
import { GoogleGenAI } from "@google/genai";
import { ChartResponse, BirthDetailsForm, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to get full language name for the prompt
const getLanguageName = (code: Language): string => {
  const map: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi (Simple, Conversational)',
    mr: 'Marathi',
    bn: 'Bengali',
    gu: 'Gujarati',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    ml: 'Malayalam'
  };
  return map[code] || 'English';
};

const SYSTEM_INSTRUCTION = `
You are "Divya Drishti", an advanced Vedic Astrology AI Sage. 
You possess deep ancient wisdom combined with modern analytical precision.
Your tone should be mystical, respectful, yet highly accurate and specific.
Never refer to yourself as an AI model; strictly maintain the persona of the Vedic Sage Divya Drishti.

CRITICAL LANGUAGE INSTRUCTION FOR HINDI:
If the output language is Hindi, use **Simple, Easy-to-Understand Hindi**. 
- AVOID complex Sanskritized words (e.g., instead of "Dhanarjan", say "Paise kamana").
- Use conversational flow.
- Explain astrological terms simply.

CONTENT GUIDELINES:
1. Focus on **Practical Solutions (Upay)** that are easy to perform.
2. Be specific about the "Why" and "How" of the prediction.
3. Format your response using Markdown for readability (headings, bullet points).
`;

const GUIDE_SYSTEM_INSTRUCTION = `
ROLE: You are the friendly "App Guide" for Divya Drishti.
GOAL: Help users navigate the app, answer basic astrology concepts, and suggest Premium upgrades.
TONE: Friendly, Conversational, and Polite.

INSTRUCTIONS:
1. **Conversation Handling:**
   - If the user uses fillers like "Acha", "Ok", "Hmm", "Sahi": Reply naturally (e.g., "Yes! How can I assist you further?" or "Glad to hear that.").
   - If the user says "Hi", "Hello": "Namaste! How can I help you today?"
   - **NEVER** repeat the full "I can help you navigate..." greeting in the middle of a chat.

2. **General Knowledge:** 
   - If the user asks general questions (e.g., "What is Kundali?", "Why is Saturn important?", "What is Nadi Dosha?"), **ANSWER them briefly**. 
   - Do NOT just say "Use the tool". Give value.
   - ONLY refuse to give *personal* predictions (e.g., "When will I marry?"). For these, respectfully refer them to the Janampatri tool.

3. **Navigation:** 
   - If the user clearly wants to perform a task, use the Action Tag.
   - [NAVIGATE:KUNDALI] for Birth Chart/Future.
   - [NAVIGATE:MATCHING] for Marriage Matching.
   - [NAVIGATE:RASHIFAL] for Daily Horoscope.

4. **Premium Upsell:** 
   - If the user asks about Gemstones or Numerology, explain the benefit briefly and suggest upgrading.
   - [PREMIUM:GEMSTONES] or [PREMIUM:NUMEROLOGY]

REQUIRED OUTPUT FORMAT:
[Natural Response Text] [ACTION_TAG (Optional)]
`;

const modelId = "gemini-2.5-flash";

export const getAstrologicalReading = async (
  birthDetails: BirthDetailsForm, 
  chartData: ChartResponse, 
  userQuestion: string,
  lang: Language
): Promise<string> => {
  
  const langName = getLanguageName(lang);

  const context = `
    Language Required: ${langName}
    User Name: ${birthDetails.name}
    Birth Details: ${birthDetails.date} ${birthDetails.time} at ${birthDetails.location}
    
    Chart Data:
    Ascendant: ${chartData.ascendant.sign}
    Planets: ${chartData.planets.map(p => `${p.name} in ${p.sign} (House ${p.house})`).join(', ')}
  `;

  const prompt = `
    ${context}
    User Question: ${userQuestion}
    
    Instructions:
    1. Answer the specific question based on the planetary positions provided.
    2. If the language is Hindi, keep it VERY SIMPLE and conversational.
    3. Provide accurate details but explain them simply.
    4. End with 2-3 specific, easy-to-do Remedies (Upay).
    
    If the question is empty, provide a "Mahadasha & General Life Reading" covering Career, Health, and Finance in ${langName} with simple remedies.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "The stars are silent at this moment. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection to the cosmos interrupted. Please check internet.";
  }
};

export const getAppGuideResponse = async (userQuestion: string, lang: Language): Promise<string> => {
    const langName = getLanguageName(lang);
    const prompt = `
      User Input: ${userQuestion}
      Language: ${langName}
      
      Respond as the friendly App Guide.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { systemInstruction: GUIDE_SYSTEM_INSTRUCTION }
        });
        return response.text || "I am here to help.";
    } catch (error) {
        console.error("Guide API Error:", error);
        throw error; // Throw to let UI handle it
    }
};

export const getDailyRashifal = async (sign: string, lang: Language): Promise<string> => {
    const langName = getLanguageName(lang);
    const prompt = `
      Generate a Daily Horoscope for ${sign} for today (${new Date().toLocaleDateString()}).
      Language: ${langName}.
      
      Structure:
      1. General Vibe (2 lines)
      2. Career & Money (Bullet points)
      3. Love & Relationship (Bullet points)
      4. Health
      5. Lucky Color & Number
      
      Tone: Mystical but practical. If Hindi, use simple conversational Hindi.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        return response.text || "Cosmic interference detected.";
    } catch (error) {
        console.error("Gemini Rashifal Error", error);
        return "Unable to fetch horoscope at this moment.";
    }
};

export const getPanchang = async (date: string, location: string, lang: Language): Promise<string> => {
    const langName = getLanguageName(lang);
    const prompt = `
      Generate the Vedic Panchang for ${date} at location: ${location}.
      Language: ${langName}.
      
      Include:
      - Tithi
      - Nakshatra
      - Yog
      - Karan
      - Sunrise & Sunset Time
      - Rahu Kaal (Time to avoid)
      - Abhijit Muhurat (Best time)
      - Special Festival (if any)
      
      Format: Clean Markdown list. If Hindi, use simple Hindi.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        return response.text || "Panchang data unavailable.";
    } catch (error) {
        console.error("Gemini Panchang Error", error);
        return "Unable to calculate Panchang.";
    }
};

export const getNumerologyReport = async (name: string, date: string, lang: Language): Promise<string> => {
    const langName = getLanguageName(lang);
    const prompt = `
      Generate a Numerology Report for:
      Name: ${name}
      Date of Birth: ${date}
      Language: ${langName}.

      Calculate and Explain:
      1. Life Path Number (Moolank)
      2. Destiny Number (Bhagyank)
      3. Personality Analysis (based on numbers)
      4. Lucky Numbers & Colors
      5. Career Prediction for this year

      Format: Markdown. If Hindi, use simple conversational Hindi.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        return response.text || "Numerology reading unavailable.";
    } catch (error) {
        console.error("Gemini Numerology Error", error);
        return "Unable to calculate Numerology report.";
    }
};

export const getGemstoneRecommendation = async (birthDetails: BirthDetailsForm, lang: Language): Promise<string> => {
    const langName = getLanguageName(lang);
    const prompt = `
      Generate Gemstone Recommendations (Ratna Paramarsh) based on Vedic Astrology for:
      Name: ${birthDetails.name}
      DOB: ${birthDetails.date} ${birthDetails.time}
      Location: ${birthDetails.location}
      Language: ${langName}.

      Provide:
      1. Life Stone (For Lagna Lord) - Benefits & How to wear.
      2. Lucky Stone (For 9th Lord) - Benefits & How to wear.
      3. Benefic Stone (For 5th Lord) - Benefits.
      4. Stones to AVOID (Important).
      
      Format: Markdown. If Hindi, use simple conversational Hindi.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        return response.text || "Gemstone recommendation unavailable.";
    } catch (error) {
        console.error("Gemini Gemstone Error", error);
        return "Unable to recommend gemstones.";
    }
};
