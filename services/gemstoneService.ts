/**
 * Gemstone Service
 * Based on Vedic Astrology (BPHS classical rules - Trikaal Vaani method)
 * Uses Kundali Lagna data (Swiss Ephemeris) for accurate gemstone recommendation
 */

import { ChartResponse } from '../types';

// Sign to Planet mapping (Lagna Lord)
const LAGNA_LORDS: Record<string, string> = {
  'Aries': 'Mars',
  'Taurus': 'Venus',
  'Gemini': 'Mercury',
  'Cancer': 'Moon',
  'Leo': 'Sun',
  'Virgo': 'Mercury',
  'Libra': 'Venus',
  'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn',
  'Aquarius': 'Saturn',
  'Pisces': 'Jupiter'
};

// Planet to Gemstone mapping (Main gemstones)
const PLANET_GEMSTONE: Record<string, {
  name: string;
  hindiName: string;
  metal: string;
  finger: string;
  day: string;
  mantra: string;
  weight: string;
  color: string;
}> = {
  'Sun': {
    name: 'Ruby',
    hindiName: 'Manikya (माणिक्य)',
    metal: 'Gold',
    finger: 'Ring finger',
    day: 'Sunday',
    mantra: 'Om Hrim Hraum Suryaya Namah',
    weight: '4-6 carats',
    color: 'Red/Pink'
  },
  'Moon': {
    name: 'Pearl',
    hindiName: 'Moti (मोती)',
    metal: 'Silver',
    finger: 'Little finger',
    day: 'Monday',
    mantra: 'Om Som Somaya Namah',
    weight: '5-7 carats',
    color: 'White/Cream'
  },
  'Mars': {
    name: 'Red Coral',
    hindiName: 'Moonga (मूंगा)',
    metal: 'Gold or Copper',
    finger: 'Ring finger',
    day: 'Tuesday',
    mantra: 'Om Ang Angarkaya Namah',
    weight: '6-9 carats',
    color: 'Red/Orange'
  },
  'Mercury': {
    name: 'Emerald',
    hindiName: 'Panna (पन्ना)',
    metal: 'Gold',
    finger: 'Little finger',
    day: 'Wednesday',
    mantra: 'Om Bum Budhaya Namah',
    weight: '4-6 carats',
    color: 'Green'
  },
  'Jupiter': {
    name: 'Yellow Sapphire',
    hindiName: 'Pukhraj (पुखराज)',
    metal: 'Gold',
    finger: 'Index finger',
    day: 'Thursday',
    mantra: 'Om Brim Brihaspataye Namah',
    weight: '5-8 carats',
    color: 'Yellow'
  },
  'Venus': {
    name: 'Diamond',
    hindiName: 'Heera (हीरा)',
    metal: 'Platinum or Silver',
    finger: 'Ring finger',
    day: 'Friday',
    mantra: 'Om Shum Shukraya Namah',
    weight: '0.5-1 carat',
    color: 'White/Clear'
  },
  'Saturn': {
    name: 'Blue Sapphire',
    hindiName: 'Neelam (नीलम)',
    metal: 'Silver',
    finger: 'Middle finger',
    day: 'Saturday',
    mantra: 'Om Sham Shanicharaya Namah',
    weight: '5-7 carats',
    color: 'Blue'
  },
  'Rahu': {
    name: 'Hessonite',
    hindiName: 'Gomed (गोमेद)',
    metal: 'Silver',
    finger: 'Middle finger',
    day: 'Saturday',
    mantra: 'Om Raam Rahave Namah',
    weight: '6-8 carats',
    color: 'Honey Brown'
  },
  'Ketu': {
    name: "Cat's Eye",
    hindiName: 'Lehsunia (लहसुनिया)',
    metal: 'Silver',
    finger: 'Little finger',
    day: 'Tuesday',
    mantra: 'Om Kem Ketave Namah',
    weight: '5-7 carats',
    color: 'Brown/Green'
  }
};

// Alternative gemstones (Uparatna) - cheaper alternatives
const UPARATNA: Record<string, string[]> = {
  'Sun': ['Garnet', 'Red Spinel', 'Sunstone'],
  'Moon': ['Moonstone', 'White Coral', 'Opal'],
  'Mars': ['Carnelian', 'Red Jasper', 'Bloodstone'],
  'Mercury': ['Peridot', 'Green Tourmaline', 'Green Zircon'],
  'Jupiter': ['Yellow Topaz', 'Citrine', 'Golden Topaz'],
  'Venus': ['White Sapphire', 'White Topaz', 'White Zircon'],
  'Saturn': ['Iolite', 'Amethyst', 'Lapis Lazuli'],
  'Rahu': ['Brown Tourmaline', 'Smoky Quartz', 'Tiger Eye'],
  'Ketu': ['Green Tourmaline', 'Alexandrite', 'Cat\'s Eye Chrysoberyl']
};

// Simple suitability check (functional benefic check)
// Note: Full suitability requires Shadbala, dusthana analysis, combustion check
// This is a simplified version based on classical BPHS rules
function checkSuitability(lagnaSign: string, planet: string): {
  score: number;
  verdict: string;
  risk: 'Low' | 'Medium' | 'High';
} {
  // For simplicity, we'll use a basic benefic/malefic assessment
  // In a full implementation, this would include:
  // - Shadbala strength
  // - Dusthana (6/8/12) ownership
  // - Combustion check
  // - Ashtakavarga points

  const beneficPlanets = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const maleficPlanets = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];

  // Taurus Lagna: Saturn is Yogakaraka (benefic)
  if (lagnaSign === 'Taurus' && planet === 'Saturn') {
    return { score: 85, verdict: 'Saturn is Yogakaraka for Taurus - Highly Recommended', risk: 'Low' };
  }

  // Aries Lagna: Saturn is malefic
  if (lagnaSign === 'Aries' && planet === 'Saturn') {
    return { score: 40, verdict: 'Saturn is malefic for Aries - Consult astrologer', risk: 'High' };
  }

  // Leo Lagna: Sun is strong (self)
  if (lagnaSign === 'Leo' && planet === 'Sun') {
    return { score: 75, verdict: 'Sun is Lagna Lord - Generally Beneficial', risk: 'Low' };
  }

  // Default assessment
  if (beneficPlanets.includes(planet)) {
    return { score: 70, verdict: 'Benefic planet - Generally Suitable', risk: 'Low' };
  }

  if (maleficPlanets.includes(planet)) {
    return { score: 50, verdict: 'Malefic planet - Consult for detailed analysis', risk: 'Medium' };
  }

  return { score: 60, verdict: 'Neutral - Further analysis recommended', risk: 'Medium' };
}

export interface GemstoneResult {
  lifeStone: {
    planet: string;
    name: string;
    hindiName: string;
    metal: string;
    finger: string;
    day: string;
    mantra: string;
    weight: string;
    color: string;
  };
  lagnaSign: string;
  lagnaLord: string;
  suitability: {
    score: number;
    verdict: string;
    risk: 'Low' | 'Medium' | 'High';
  };
  uparatna: string[];
  wearingInstructions: string[];
  precautions: string[];
}

export function calculateGemstone(chartData: ChartResponse): GemstoneResult {
  const lagnaSign = chartData.ascendant.sign;
  const lagnaLord = LAGNA_LORDS[lagnaSign] || 'Unknown';

  const lifeStoneData = PLANET_GEMSTONE[lagnaLord] || PLANET_GEMSTONE['Sun'];
  const uparatnaList = UPARATNA[lagnaLord] || [];

  const suitability = checkSuitability(lagnaSign, lagnaLord);

  const wearingInstructions = [
    `Wear on ${lifeStoneData.day} for best results`,
    `Set in ${lifeStoneData.metal}`,
    `Wear on ${lifeStoneData.finger}`,
    `Wear during Shukla Paksha (waxing moon)`,
    `Purify by dipping in Ganga water or milk before wearing`,
    `Recite mantra: ${lifeStoneData.mantra} (108 times)`
  ];

  const precautions = [
    'Consult a qualified astrologer before wearing',
    'Ensure gemstone is natural and certified',
    'Do not wear if the planet is combust or in dusthana',
    'Remove during eclipse, death in family, or inauspicious periods',
    'Regular cleaning and energizing required',
    'Weight should be appropriate for your body weight'
  ];

  return {
    lifeStone: {
      planet: lagnaLord,
      name: lifeStoneData.name,
      hindiName: lifeStoneData.hindiName,
      metal: lifeStoneData.metal,
      finger: lifeStoneData.finger,
      day: lifeStoneData.day,
      mantra: lifeStoneData.mantra,
      weight: lifeStoneData.weight,
      color: lifeStoneData.color
    },
    lagnaSign,
    lagnaLord,
    suitability,
    uparatna: uparatnaList,
    wearingInstructions,
    precautions
  };
}

// Get gemstone by planet (for Mahadasha lord)
export function getGemstoneByPlanet(planet: string) {
  return PLANET_GEMSTONE[planet] || null;
}
