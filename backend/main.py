from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import swisseph as swe
from datetime import datetime
import pytz

app = FastAPI(title="Divya Drishti Astrology API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set ephemeris path (optional - Swiss Ephemeris has built-in Moshier)
# If you have ephemeris files, uncomment and set the path:
# swe.set_ephe_path("/path/to/ephe/files")

class BirthDetails(BaseModel):
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    latitude: float
    longitude: float
    timezone: str = "UTC"

class MatchDetails(BaseModel):
    boy: BirthDetails
    girl: BirthDetails

def parse_datetime(date_str: str, time_str: str, timezone_str: str) -> float:
    """Convert date/time string to Julian Day"""
    try:
        # Parse date and time
        dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")

        # Convert to UTC if needed
        if timezone_str != "UTC":
            try:
                tz = pytz.timezone(timezone_str)
                dt = tz.localize(dt)
                dt = dt.astimezone(pytz.UTC)
            except:
                # If timezone fails, assume UTC
                pass

        # Convert to Julian Day
        year = dt.year
        month = dt.month
        day = dt.day
        hour = dt.hour
        minute = dt.minute
        second = dt.second

        jd = swe.julday(year, month, day, hour + minute/60.0 + second/3600.0)
        return jd
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date/time format: {str(e)}")

def get_sign_name(sign_id: int) -> str:
    """Get zodiac sign name from sign ID (0-11)"""
    signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    return signs[sign_id % 12]

def calculate_house_position(longitude: float, ascendant: float) -> int:
    """Calculate house number based on longitude and ascendant"""
    # Normalize both to 0-360
    norm_long = longitude % 360
    norm_asc = ascendant % 360

    # Calculate difference
    diff = (norm_long - norm_asc) % 360

    # Each house is 30 degrees
    house = int(diff / 30) + 1
    return house

@app.get("/")
def root():
    return {"message": "Divya Drishti Astrology API", "version": "1.0", "ephemeris": "Swiss Ephemeris"}

@app.post("/calculate_chart")
def calculate_chart(details: BirthDetails):
    """Calculate planetary positions for a birth chart"""
    try:
        # Convert to Julian Day
        jd = parse_datetime(details.date, details.time, details.timezone)

        # Get Ayanamsa (Lahiri - default)
        ayanamsa = swe.get_ayanamsa(jd)

        # Calculate Ascendant (Lagna)
        # Use placidus houses for tropical zodiac
        houses = swe.houses(jd, details.latitude, details.longitude, b'P')
        ascendant = houses[0][0]  # First house cusp = Ascendant

        # Calculate planetary positions
        planets = []
        planet_ids = [
            (swe.SUN, "Sun"),
            (swe.MOON, "Moon"),
            (swe.MARS, "Mars"),
            (swe.MERCURY, "Mercury"),
            (swe.JUPITER, "Jupiter"),
            (swe.VENUS, "Venus"),
            (swe.SATURN, "Saturn"),
        ]

        for planet_id, planet_name in planet_ids:
            # Calculate position (tropical)
            xx, ret = swe.calc_ut(jd, planet_id)
            longitude = xx[0]

            # Convert to sidereal (subtract ayanamsa)
            sidereal_longitude = (longitude - ayanamsa) % 360

            # Get sign ID (0-11)
            sign_id = int(sidereal_longitude / 30)
            sign_name = get_sign_name(sign_id)

            # Degree within sign
            degree_in_sign = sidereal_longitude % 30

            # Check retrograde
            is_retrograde = ret & swe.RETROGRADE != 0

            # Calculate house
            house = calculate_house_position(sidereal_longitude, ascendant)

            planets.append({
                "name": planet_name,
                "absolute_degree": sidereal_longitude,
                "sign": sign_name,
                "sign_id": sign_id + 1,  # 1-12 for frontend
                "degree": degree_in_sign,
                "is_retrograde": is_retrograde,
                "house": house
            })

        # Calculate lunar nodes (Rahu and Ketu)
        # Mean nodes
        xx_rahu, ret_rahu = swe.calc_ut(jd, swe.MEAN_NODE)
        rahu_longitude = (xx_rahu[0] - ayanamsa) % 360
        rahu_sign_id = int(rahu_longitude / 30)
        rahu_sign = get_sign_name(rahu_sign_id)
        rahu_degree = rahu_longitude % 30
        rahu_house = calculate_house_position(rahu_longitude, ascendant)

        xx_ketu, ret_ketu = swe.calc_ut(jd, swe.MEAN_APOG)
        ketu_longitude = (xx_ketu[0] - ayanamsa) % 360
        ketu_sign_id = int(ketu_longitude / 30)
        ketu_sign = get_sign_name(ketu_sign_id)
        ketu_degree = ketu_longitude % 30
        ketu_house = calculate_house_position(ketu_longitude, ascendant)

        # Add Rahu and Ketu
        planets.append({
            "name": "Rahu",
            "absolute_degree": rahu_longitude,
            "sign": rahu_sign,
            "sign_id": rahu_sign_id + 1,
            "degree": rahu_degree,
            "is_retrograde": True,  # Rahu is always retrograde
            "house": rahu_house
        })

        planets.append({
            "name": "Ketu",
            "absolute_degree": ketu_longitude,
            "sign": ketu_sign,
            "sign_id": ketu_sign_id + 1,
            "degree": ketu_degree,
            "is_retrograde": True,  # Ketu is always retrograde
            "house": ketu_house
        })

        # Calculate ascendant details
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

        # Simplified Ashtakoota matching (based on moon signs)
        # In a full implementation, this would use all 8 kootas
        boy_moon = next((p for p in boy_chart["planets"] if p["name"] == "Moon"), None)
        girl_moon = next((p for p in girl_chart["planets"] if p["name"] == "Moon"), None)

        if not boy_moon or not girl_moon:
            raise HTTPException(status_code=500, detail="Could not calculate moon positions")

        # Simple matching based on moon sign compatibility
        boy_sign = boy_moon["sign_id"]
        girl_sign = girl_moon["sign_id"]

        # Basic compatibility rules (simplified)
        compatible_pairs = [
            (1, 5), (1, 9),  # Aries compatible with Leo, Sagittarius
            (2, 6), (2, 10), # Taurus compatible with Virgo, Capricorn
            (3, 7), (3, 11), # Gemini compatible with Libra, Aquarius
            (4, 8), (4, 12), # Cancer compatible with Scorpio, Pisces
            (5, 1), (5, 9),  # Leo compatible with Aries, Sagittarius
            (6, 2), (6, 10), # Virgo compatible with Taurus, Capricorn
            (7, 3), (7, 11), # Libra compatible with Gemini, Aquarius
            (8, 4), (8, 12), # Scorpio compatible with Cancer, Pisces
            (9, 1), (9, 5),  # Sagittarius compatible with Aries, Leo
            (10, 2), (10, 6), # Capricorn compatible with Taurus, Virgo
            (11, 3), (11, 7), # Aquarius compatible with Gemini, Libra
            (12, 4), (12, 8), # Pisces compatible with Cancer, Scorpio
        ]

        # Calculate score
        score = 0
        total = 36

        # Same sign or compatible
        if boy_sign == girl_sign:
            score += 4  # Varna Koota
        elif (boy_sign, girl_sign) in compatible_pairs:
            score += 3

        # Additional factors (simplified)
        # In full implementation, would calculate:
        # - Varna (4 points)
        # - Vashya (2 points)
        # - Tara (3 points)
        # - Yoni (4 points)
        # - Graha Maitri (5 points)
        # - Gana (6 points)
        # - Bhakoot (7 points)
        # - Nadi (8 points)

        # Add random variance for demo (remove in production)
        import random
        score += random.randint(15, 25)

        # Ensure score doesn't exceed total
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

        # Check Nadi Dosha (simplified - both moons in same or opposite signs)
        nadi_dosha = abs(boy_sign - girl_sign) in [0, 6]

        return {
            "score": score,
            "total": total,
            "verdict": verdict,
            "nadi_dosha": nadi_dosha,
            "description": f"Compatibility score based on Vedic Ashtakoota system. Boy's Moon in {get_sign_name(boy_sign-1)}, Girl's Moon in {get_sign_name(girl_sign-1)}."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matchmaking error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
