
export interface LocationResult {
  name: string;
  lat: number;
  lon: number;
}

// OpenStreetMap Nominatim API for search
// Note: In a high-traffic production app, you should use a paid API or your own tile server.
// This is free for limited usage.

export const searchCities = async (query: string): Promise<LocationResult[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=in`;
    const response = await fetch(url, {
        headers: {
            'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8'
        }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.display_name, // Full address
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error("Location search failed:", error);
    return [];
  }
};

export const getAddressFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.address) {
        // Construct a clean address string
        const parts = [];
        const a = data.address;
        if (a.suburb) parts.push(a.suburb);
        if (a.city || a.town || a.village) parts.push(a.city || a.town || a.village);
        if (a.state_district) parts.push(a.state_district);
        if (a.state) parts.push(a.state);
        if (a.country) parts.push(a.country);
        
        return parts.join(", ");
    }
    return data.display_name || "Unknown Location";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
};