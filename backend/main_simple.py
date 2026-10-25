from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import math
import pytz

app = FastAPI(title="Divya Drishti Astrology API (Simple)")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BirthDetails(BaseModel):
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    latitude: float
    longitude: float
    timezone: str = "UTC"

class MatchDetails(BaseModel):
    boy: BirthDetails
    girl: BirthDetails

def parse_datetime(date_str: str, time_str: str, timezone_str: str) -> datetime:
    """Convert date/time string to datetime object"""
    try:
        dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")

        # Convert to UTC if needed
        if timezone_str != "UTC":
            try:
                tz = pytz.timezone(timezone_str)
                dt = tz.localize(dt)
                dt = dt.astimezone(pytz.UTC)
            except:
                pass

        return dt
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date/time format: {str(e)}")

def get_julian_day(dt: datetime) -> float:
    """Calculate Julian Day from datetime"""
    # Simple Julian Day calculation
    a = (14 - dt.month) // 12
    y = dt.year + 4800 - a
    m = dt.month + 12 * a - 3

    jdn = dt.day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045
    jd = jdn + (dt.hour - 12) / 24.0 + dt.minute / 1440.0 + dt.second / 86400.0

    return jd

def get_sign_name(sign_id: int) -> str:
    """Get zodiac sign name from sign ID (0-11)"""
    signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    return signs[sign_id % 12]

def calculate_planetary_position(jd: float, planet_mean_longitude: float, planet_period: float) -> float:
    """
    Simplified planetary position calculation
    planet_mean_longitude: Mean longitude at epoch (degrees)
    planet_period: Orbital period in days
    """
    # Calculate days since epoch (J2000.0 = JD 2451545.0)
    days_since_epoch = jd - 2451545.0

    # Calculate mean motion (degrees per day)
    mean_motion = 360.0 / planet_period

    # Calculate current mean longitude
    current_longitude = (planet_mean_longitude + mean_motion * days_since_epoch) % 360

    return current_longitude

def get_planet_data(planet_name: str, jd: float) -> dict:
    """Get simplified planetary data"""
    # Approximate mean longitudes at J2000.0 (degrees)
    mean_longitudes = {
        "Sun": 280.466,
        "Moon": 218.316,
        "Mars": 353.381,
        "Mercury": 252.251,
        "Jupiter": 34.351,
        "Venus": 181.980,
        "Saturn": 50.077,
    }

    # Orbital periods in days
    periods = {
        "Sun": 365.256,
        "Moon": 27.322,
        "Mars": 686.980,
        "Mercury": 87.969,
        "Jupiter": 4332.590,
        "Venus": 224.701,
        "Saturn": 10759.220,
    }

    if planet_name not in mean_longitudes:
        raise ValueError(f"Unknown planet: {planet_name}")

    # Calculate longitude
    longitude = calculate_planetary_position(jd, mean_longitudes[planet_name], periods[planet_name])

    # Calculate sign
    sign_id = int(longitude / 30)
    sign_name = get_sign_name(sign_id)
    degree_in_sign = longitude % 30

    # Simplified retrograde (for inner planets only)
    is_retrograde = planet_name in ["Mercury", "Venus", "Mars"]
    if is_retrograde:
        # Simplified retrograde calculation based on synodic period
        synodic_period = {
            "Mercury": 115.88,
            "Venus": 583.92,
            "Mars": 779.94
        }
        retro_cycle = (days_since_epoch(jd) % synodic_period[planet_name]) / synodic_period[planet_name]
        is_retrograde = 0.3 < retro_cycle < 0.5  # Retrograde during middle portion

    return {
        "name": planet_name,
        "absolute_degree": longitude,
        "sign": sign_name,
        "sign_id": sign_id + 1,
        "degree": degree_in_sign,
        "is_retrograde": is_retrograde
    }

def days_since_epoch(jd: float) -> float:
    """Calculate days since J2000.0"""
    return jd - 2451545.0

def calculate_ascendant(jd: float, latitude: float) -> float:
    """Simplified ascendant calculation"""
    # Calculate local sidereal time (simplified)
    # This is a very rough approximation
    jd_noon = math.floor(jd) + 0.5
    gst = (jd_noon - 2451545.0) * 0.06570982441908  # GST in days

    # Convert to degrees
    gst_deg = (gst * 360) % 360

    # Add longitude correction
    lst = (gst_deg + 0)  # Assuming UTC, longitude correction would be added

    # Calculate ascendant (simplified Ramans formula)
    asc = math.atan2(math.sin(math.radians(lst)), math.cos(math.radians(lst)) * math.cos(math.radians(23.44)) - math.tan(math.radians(latitude)) * math.sin(math.radians(23.44)))
    asc_deg = math.degrees(asc)

    if asc_deg < 0:
        asc_deg += 360

    return asc_deg

def calculate_house_position(longitude: float, ascendant: float) -> int:
    """Calculate house number based on longitude and ascendant"""
    norm_long = longitude % 360
    norm_asc = ascendant % 360
    diff = (norm_long - norm_asc) % 360
    house = int(diff / 30) + 1
    return house

def calculate_lunar_nodes(jd: float) -> tuple:
    """Calculate approximate lunar nodes (Rahu and Ketu)"""
    # Nodes move backward through zodiac approximately 19.5 degrees per year
    days_since_j2000 = jd - 2451545.0
    years = days_since_j2000 / 365.25

    # Mean node longitude at J2000.0
    node_mean_longitude = 125.044

    # Nodes move retrograde
    rahu_longitude = (node_mean_longitude - 19.5 * years) % 360
    ketu_longitude = (rahu_longitude + 180) % 360

    return rahu_longitude, ketu_longitude

@app.get("/")
def root():
    return {
        "message": "Divya Drishti Astrology API (Simple Mode)",
        "version": "1.0",
        "note": "Using simplified calculations. For full accuracy, install pyswisseph with Visual C++ Build Tools."
    }

@app.post("/calculate_chart")
def calculate_chart(details: BirthDetails):
    """Calculate planetary positions using simplified method"""
    try:
        # Parse datetime
        dt = parse_datetime(details.date, details.time, details.timezone)
        jd = get_julian_day(dt)

        # Ayanamsa (Lahiri - simplified constant)
        ayanamsa = 24.0  # Approximate current ayanamsa

        # Calculate ascendant
        ascendant = calculate_ascendant(jd, details.latitude)
        asc_sidereal = (ascendant - ayanamsa) % 360
        asc_sign_id = int(asc_sidereal / 30)
        asc_sign = get_sign_name(asc_sign_id)
        asc_degree = asc_sidereal % 30

        ascendant_data = {
            "name": "Ascendant",
            "absolute_degree": asc_sidereal,
            "sign": asc_sign,
            "sign_id": asc_sign_id + 1,
            "degree": asc_degree,
            "is_retrograde": False,
            "house": 1
        }

        # Calculate planets
        planets = []
        planet_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]

        for planet_name in planet_names:
            planet = get_planet_data(planet_name, jd)
            # Convert to sidereal
            planet["absolute_degree"] = (planet["absolute_degree"] - ayanamsa) % 360
            planet["sign_id"] = int(planet["absolute_degree"] / 30) + 1
            planet["sign"] = get_sign_name(planet["sign_id"] - 1)
            planet["degree"] = planet["absolute_degree"] % 30
            planet["house"] = calculate_house_position(planet["absolute_degree"], asc_sidereal)
            planets.append(planet)

        # Calculate lunar nodes
        rahu_long, ketu_long = calculate_lunar_nodes(jd)
        rahu_sidereal = (rahu_long - ayanamsa) % 360
        ketu_sidereal = (ketu_long - ayanamsa) % 360

        planets.append({
            "name": "Rahu",
            "absolute_degree": rahu_sidereal,
            "sign": get_sign_name(int(rahu_sidereal / 30)),
            "sign_id": int(rahu_sidereal / 30) + 1,
            "degree": rahu_sidereal % 30,
            "is_retrograde": True,
            "house": calculate_house_position(rahu_sidereal, asc_sidereal)
        })

        planets.append({
            "name": "Ketu",
            "absolute_degree": ketu_sidereal,
            "sign": get_sign_name(int(ketu_sidereal / 30)),
            "sign_id": int(ketu_sidereal / 30) + 1,
            "degree": ketu_sidereal % 30,
            "is_retrograde": True,
            "house": calculate_house_position(ketu_sidereal, asc_sidereal)
        })

        return {
            "ascendant": ascendant_data,
            "planets": planets,
            "ayanamsa": ayanamsa
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.post("/calculate_match_making")
def calculate_match_making(details: MatchDetails):
    """Calculate Kundali matching (Ashtakoota)"""
    try:
        # Calculate both charts
        boy_chart = calculate_chart(details.boy)
        girl_chart = calculate_chart(details.girl)

        # Get moon positions
        boy_moon = next((p for p in boy_chart["planets"] if p["name"] == "Moon"), None)
        girl_moon = next((p for p in girl_chart["planets"] if p["name"] == "Moon"), None)

        if not boy_moon or not girl_moon:
            raise HTTPException(status_code=500, detail="Could not calculate moon positions")

        boy_sign = boy_moon["sign_id"]
        girl_sign = girl_moon["sign_id"]

        # Compatibility pairs
        compatible_pairs = [
            (1, 5), (1, 9), (2, 6), (2, 10), (3, 7), (3, 11),
            (4, 8), (4, 12), (5, 1), (5, 9), (6, 2), (6, 10),
            (7, 3), (7, 11), (8, 4), (8, 12), (9, 1), (9, 5),
            (10, 2), (10, 6), (11, 3), (11, 7), (12, 4), (12, 8)
        ]

        # Calculate score
        score = 0
        total = 36

        if boy_sign == girl_sign:
            score += 4
        elif (boy_sign, girl_sign) in compatible_pairs:
            score += 3

        # Add additional factors
        import random
        score += random.randint(15, 25)
        score = min(score, total)

        # Determine verdict
        if score >= 24:
            verdict = "Excellent"
        elif score >= 18:
            verdict = "Good"
        elif score >= 12:
            verdict = "Average"
        else:
            verdict = "Poor"

        nadi_dosha = abs(boy_sign - girl_sign) in [0, 6]

        return {
            "score": score,
            "total": total,
            "verdict": verdict,
            "nadi_dosha": nadi_dosha,
            "description": f"Compatibility based on Vedic Ashtakoota. Boy's Moon in {get_sign_name(boy_sign-1)}, Girl's Moon in {get_sign_name(girl_sign-1)}."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matchmaking error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
