
import { ChartResponse, BirthDetailsForm, MatchMakingDetails } from '../types';

// Logic: If hostname is localhost, use port 8000. 
// If deployed (Render/Netlify where frontend is served by backend), use empty string for relative path.
const getBackendUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:8000';
    }
    return ''; // Relative path for production
};

const BACKEND_URL = getBackendUrl();

/**
 * Mocks the backend response if the python server is not running
 * so the user can still experience the UI and Gemini integration.
 */
const getMockChartData = (): ChartResponse => {
    return {
        ascendant: {
            name: "Ascendant", absolute_degree: 125.4, sign: "Leo", sign_id: 5, degree: 5.4, is_retrograde: false, house: 1
        },
        planets: [
            { name: "Sun", absolute_degree: 45.2, sign: "Taurus", sign_id: 2, degree: 15.2, is_retrograde: false, house: 10 },
            { name: "Moon", absolute_degree: 210.5, sign: "Scorpio", sign_id: 8, degree: 0.5, is_retrograde: false, house: 4 },
            { name: "Mars", absolute_degree: 95.1, sign: "Cancer", sign_id: 4, degree: 5.1, is_retrograde: false, house: 12 },
            { name: "Mercury", absolute_degree: 55.3, sign: "Taurus", sign_id: 2, degree: 25.3, is_retrograde: false, house: 10 },
            { name: "Jupiter", absolute_degree: 340.2, sign: "Pisces", sign_id: 12, degree: 10.2, is_retrograde: true, house: 8 },
            { name: "Venus", absolute_degree: 85.1, sign: "Gemini", sign_id: 3, degree: 25.1, is_retrograde: false, house: 11 },
            { name: "Saturn", absolute_degree: 280.4, sign: "Capricorn", sign_id: 10, degree: 10.4, is_retrograde: true, house: 6 },
            { name: "Rahu", absolute_degree: 10.5, sign: "Aries", sign_id: 1, degree: 10.5, is_retrograde: true, house: 9 },
            { name: "Ketu", absolute_degree: 190.5, sign: "Libra", sign_id: 7, degree: 10.5, is_retrograde: true, house: 3 },
        ],
        ayanamsa: 24.1
    };
};

export const fetchChartData = async (details: BirthDetailsForm): Promise<ChartResponse> => {
    try {
        const response = await fetch(`${BACKEND_URL}/calculate_chart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: details.date,
                time: details.time,
                latitude: details.latitude,
                longitude: details.longitude,
                timezone: "UTC" // Simplification for demo
            }),
        });

        if (!response.ok) {
            throw new Error('Backend unavailable');
        }

        return await response.json();
    } catch (error) {
        console.warn("Backend fetch failed, using internal calculation mock for demo purposes.", error);
        // Reduced delay to 200ms for better UX
        await new Promise(resolve => setTimeout(resolve, 200));
        return getMockChartData();
    }
};

export const fetchMatchMaking = async (details: MatchMakingDetails): Promise<any> => {
    try {
         const response = await fetch(`${BACKEND_URL}/calculate_match_making`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                boy: {
                    date: details.boyDate,
                    time: details.boyTime,
                    latitude: 28.6139, longitude: 77.2090, // Demo coords, normally geocode from location string
                    timezone: "UTC"
                },
                girl: {
                    date: details.girlDate,
                    time: details.girlTime,
                    latitude: 28.6139, longitude: 77.2090,
                    timezone: "UTC"
                }
            })
         });
         
         if (!response.ok) throw new Error("Backend unavailable");
         return await response.json();

    } catch (error) {
        console.warn("Matching backend failed, returning mock", error);
        // Reduced delay to 200ms for better UX
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
            score: 28.5,
            total: 36,
            verdict: "Excellent",
            nadi_dosha: false,
            description: "High compatibility found in mental and financial aspects. (Mock Result - Backend Unavailable)"
        };
    }
}
