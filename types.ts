
export interface PlanetData {
  name: string;
  absolute_degree: number;
  sign: string;
  sign_id: number;
  degree: number;
  is_retrograde: boolean;
  house: number;
}

export interface ChartResponse {
  ascendant: PlanetData;
  planets: PlanetData[];
  ayanamsa: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isPremium?: boolean;
  chartCount?: number;
}

export interface BirthDetailsForm {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
}

// Support for English, Hindi, Marathi, Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam
export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'gu' | 'ta' | 'te' | 'kn' | 'ml';

export interface MatchMakingDetails {
  boyName: string;
  boyDate: string;
  boyTime: string;
  boyLocation: string;
  girlName: string;
  girlDate: string;
  girlTime: string;
  girlLocation: string;
}

export type AppView = 'dashboard' | 'kundali' | 'rashifal' | 'matching' | 'panchang' | 'profile' | 'numerology' | 'gemstones';
