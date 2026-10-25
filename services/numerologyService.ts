/**
 * Numerology Service
 * Based on Cheiro / Vedic Numerology (Trikaal Vaani method)
 * Pure mathematical calculations - No AI, No Swiss Ephemeris needed
 */

// Chaldean letter-to-number mapping (Indian standard)
const CHALDEAN_MAPPING: Record<string, number> = {
  'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
  'B': 2, 'K': 2, 'R': 2,
  'C': 3, 'G': 3, 'L': 3, 'S': 3,
  'D': 4, 'M': 4, 'T': 4,
  'E': 5, 'H': 5, 'N': 5, 'X': 5,
  'U': 6, 'V': 6, 'W': 6,
  'O': 7, 'Z': 7,
  'F': 8, 'P': 8
  // Note: 9 is sacred in Chaldean and not used in name numbers
};

// Number to Planet mapping
const NUMBER_PLANET: Record<number, { planet: string; color: string; day: string }> = {
  1: { planet: 'Sun', color: 'Orange/Gold', day: 'Sunday' },
  2: { planet: 'Moon', color: 'White/Silver', day: 'Monday' },
  3: { planet: 'Jupiter', color: 'Yellow', day: 'Thursday' },
  4: { planet: 'Rahu', color: 'Blue', day: 'Saturday' },
  5: { planet: 'Mercury', color: 'Green', day: 'Wednesday' },
  6: { planet: 'Venus', color: 'Pink/White', day: 'Friday' },
  7: { planet: 'Ketu', color: 'Violet', day: 'Tuesday' },
  8: { planet: 'Saturn', color: 'Black/Blue', day: 'Saturday' },
  9: { planet: 'Mars', color: 'Red', day: 'Tuesday' }
};

// Lucky dates based on Mulank
const LUCKY_DATES: Record<number, number[]> = {
  1: [1, 10, 19, 28],
  2: [2, 11, 20, 29],
  3: [3, 12, 21, 30],
  4: [4, 13, 22, 31],
  5: [5, 14, 23],
  6: [6, 15, 24],
  7: [7, 16, 25],
  8: [8, 17, 26],
  9: [9, 18, 27]
};

// Reduce number to single digit (1-9)
function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    const digits = num.toString().split('').map(Number);
    num = digits.reduce((sum, d) => sum + d, 0);
  }
  return num;
}

// Calculate Mulank (Birth Number) from day of birth
export function calculateMulank(day: number): number {
  // Mulank uses only the day (1-31), not month or year
  return reduceToSingleDigit(day);
}

// Calculate Bhagyank (Destiny Number) from full date of birth
export function calculateBhagyank(date: string): number {
  // Format: YYYY-MM-DD
  const [year, month, day] = date.split('-').map(Number);

  // Add all digits: year (4 digits) + month (2 digits) + day (2 digits)
  const allDigits = [
    ...year.toString().split('').map(Number),
    ...month.toString().split('').map(Number),
    ...day.toString().split('').map(Number)
  ];

  const sum = allDigits.reduce((total, digit) => total + digit, 0);
  return reduceToSingleDigit(sum);
}

// Calculate Naamank (Name Number) using Chaldean system
export function calculateNaamank(name: string): number {
  // Convert to uppercase, remove spaces and special characters
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');

  let sum = 0;
  for (const char of cleanName) {
    const value = CHALDEAN_MAPPING[char];
    if (value) {
      sum += value;
    }
  }

  return reduceToSingleDigit(sum);
}

// Get lucky dates for a given Mulank
export function getLuckyDates(mulank: number): number[] {
  return LUCKY_DATES[mulank] || [];
}

// Get planet, color, and day for a number
export function getNumberAttributes(num: number) {
  return NUMBER_PLANET[num] || { planet: 'Unknown', color: 'Unknown', day: 'Unknown' };
}

// Full numerology calculation
export interface NumerologyResult {
  mulank: number;
  bhagyank: number;
  naamank?: number;
  mulankPlanet: string;
  mulankColor: string;
  mulankDay: string;
  bhagyankPlanet: string;
  bhagyankColor: string;
  bhagyankDay: string;
  luckyDates: number[];
  interpretation: {
    mulank: string;
    bhagyank: string;
    naamank?: string;
  };
}

// Mulank interpretations (swabhav ke sanket)
const MULANK_INTERPRETATIONS: Record<number, string> = {
  1: "Leadership qualities, independence, ambition. You are a natural leader with strong willpower.",
  2: "Diplomatic, sensitive, cooperative. You work well with others and have good intuition.",
  3: "Creative, expressive, optimistic. You have artistic talents and love communication.",
  4: "Practical, hardworking, disciplined. You build strong foundations and are reliable.",
  5: "Adaptable, adventurous, freedom-loving. You embrace change and seek new experiences.",
  6: "Responsible, nurturing, domestic. You care deeply for family and home.",
  7: "Analytical, spiritual, introspective. You seek deeper meaning and wisdom.",
  8: "Ambitious, materialistic, authoritative. You have strong business acumen.",
  9: "Humanitarian, compassionate, idealistic. You care for others and seek to serve."
};

// Bhagyank interpretations (badi disha)
const BHAGYANK_INTERPRETATIONS: Record<number, string> = {
  1: "Your destiny leads toward leadership roles and independent paths. Success comes through individual initiative.",
  2: "Your destiny involves partnerships and cooperation. Success comes through working with others.",
  3: "Your destiny is tied to creativity and self-expression. Success in artistic or communication fields.",
  4: "Your destiny requires building foundations and stability. Success through hard work and perseverance.",
  5: "Your destiny brings change and freedom. Success through adaptability and new opportunities.",
  6: "Your destiny is connected to home, family, and responsibility. Success through nurturing others.",
  7: "Your destiny involves spiritual growth and learning. Success through wisdom and inner development.",
  8: "Your destiny leads to material success and authority. Success through business and management.",
  9: "Your destiny is humanitarian in nature. Success through serving others and charitable work."
};

// Naamank interpretations
const NAAMANK_INTERPRETATIONS: Record<number, string> = {
  1: "Your name reflects leadership and independence. It supports individual achievements.",
  2: "Your name indicates cooperation and diplomacy. It supports partnerships and teamwork.",
  3: "Your name suggests creativity and expression. It supports artistic and communication fields.",
  4: "Your name reflects practicality and stability. It supports building and organizing.",
  5: "Your name indicates freedom and adaptability. It supports change and new ventures.",
  6: "Your name suggests responsibility and care. It supports family and domestic success.",
  7: "Your name reflects spirituality and analysis. It supports intellectual and spiritual pursuits.",
  8: "Your name indicates ambition and material success. It supports business and authority.",
  9: "Your name suggests humanitarianism and compassion. It supports serving others."
};

export function calculateNumerology(date: string, name?: string): NumerologyResult {
  const [year, month, day] = date.split('-').map(Number);

  const mulank = calculateMulank(day);
  const bhagyank = calculateBhagyank(date);
  const naamank = name ? calculateNaamank(name) : undefined;

  const mulankAttrs = getNumberAttributes(mulank);
  const bhagyankAttrs = getNumberAttributes(bhagyank);

  return {
    mulank,
    bhagyank,
    naamank,
    mulankPlanet: mulankAttrs.planet,
    mulankColor: mulankAttrs.color,
    mulankDay: mulankAttrs.day,
    bhagyankPlanet: bhagyankAttrs.planet,
    bhagyankColor: bhagyankAttrs.color,
    bhagyankDay: bhagyankAttrs.day,
    luckyDates: getLuckyDates(mulank),
    interpretation: {
      mulank: MULANK_INTERPRETATIONS[mulank],
      bhagyank: BHAGYANK_INTERPRETATIONS[bhagyank],
      naamank: naamank ? NAAMANK_INTERPRETATIONS[naamank] : undefined
    }
  };
}
