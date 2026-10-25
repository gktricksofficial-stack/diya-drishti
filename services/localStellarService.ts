
import { Language } from '../types';

// Static Data for Horoscope to avoid API calls
const HOROSCOPE_DB: Record<string, Record<Language, string>> = {
  "Aries": {
    en: "**General**: High energy day. Take initiative.\n**Career**: Good for new projects.\n**Love**: Passion is high.\n**Lucky Color**: Red",
    hi: "**सामान्य**: उच्च ऊर्जा वाला दिन। पहल करें।\n**करियर**: नई परियोजनाओं के लिए अच्छा।\n**प्रेम**: उत्साह बना रहेगा।\n**शुभ रंग**: लाल",
    mr: "शुभ दिवस. नवीन सुरुवात करा.", bn: "শুভ দিন।", gu: "શુભ દિવસ.", ta: "நல்ல நாள்.", te: "శుభ దినం.", kn: "ಶುಭ ದಿನ.", ml: "നല്ല ദിവസം."
  },
  "Taurus": {
    en: "**General**: Focus on stability.\n**Career**: Avoid risky investments.\n**Love**: Spend time with family.\n**Lucky Color**: White",
    hi: "**सामान्य**: स्थिरता पर ध्यान दें।\n**करियर**: जोखिम भरे निवेश से बचें।\n**प्रेम**: परिवार के साथ समय बिताएं।\n**शुभ रंग**: सफेद",
    mr: "स्थिरता ठेवा.", bn: "স্থিরতা বজায় রাখুন।", gu: "સ્થિરતા જાળવો.", ta: "நிலையாக இருங்கள்.", te: "స్థిరంగా ఉండండి.", kn: "ಸ್ಥಿರವಾಗಿರಿ.", ml: "സ്ഥിരത പാലിക്കുക."
  },
  "Gemini": {
    en: "**General**: Communication is key today.\n**Career**: Network with peers.\n**Love**: Express your feelings.\n**Lucky Color**: Green",
    hi: "**सामान्य**: संचार आज महत्वपूर्ण है।\n**करियर**: सहकर्मियों से बात करें।\n**प्रेम**: अपनी भावनाओं को व्यक्त करें।\n**शुभ रंग**: हरा",
    mr: "संवाद साधा.", bn: "যোগাযোগ রাখুন।", gu: "વાતચીત કરો.", ta: "பேசுங்கள்.", te: "మాట్లాడండి.", kn: "ಮಾತನಾಡಿ.", ml: "സംസാരിക്കുക."
  },
  "Cancer": {
    en: "**General**: Emotional balance needed.\n**Career**: Trust your intuition.\n**Love**: Be supportive.\n**Lucky Color**: Silver",
    hi: "**सामान्य**: भावनात्मक संतुलन आवश्यक।\n**करियर**: अपनी अंतर्ज्ञान पर भरोसा करें।\n**प्रेम**: सहयोगी बनें।\n**शुभ रंग**: चांदी",
    mr: "भावनांवर नियंत्रण ठेवा.", bn: "আবেগ নিয়ন্ত্রণ করুন।", gu: "લાગણીઓ પર કાબૂ રાખો.", ta: "உணர்ச்சிகளைக் கட்டுப்படுத்துங்கள்.", te: "భావోద్వేగాలను అదుపులో ఉంచుకోండి.", kn: "ಭಾವನೆಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ.", ml: "വികാരങ്ങളെ നിയന്ത്രിക്കുക."
  },
  "Leo": {
    en: "**General**: Shine bright today.\n**Career**: Leadership opportunities.\n**Love**: Romantic gestures work.\n**Lucky Color**: Gold",
    hi: "**सामान्य**: आज चमकें।\n**करियर**: नेतृत्व के अवसर।\n**प्रेम**: रोमांटिक इशारे काम करेंगे।\n**शुभ रंग**: सुनहरा",
    mr: "नेतृत्व करा.", bn: "নেতৃত্ব দিন।", gu: "નેતૃત્વ કરો.", ta: "தலைமை தாங்குங்கள்.", te: "నాయకత్వం వహించండి.", kn: "ನಾಯಕತ್ವ ವಹಿಸಿ.", ml: "നേതൃത്വം നൽകുക."
  },
  "Virgo": {
    en: "**General**: Organize your life.\n**Career**: Detail-oriented tasks.\n**Love**: Practical love.\n**Lucky Color**: Navy Blue",
    hi: "**सामान्य**: जीवन व्यवस्थित करें।\n**करियर**: विवरण पर ध्यान दें।\n**प्रेम**: व्यावहारिक प्रेम।\n**शुभ रंग**: गहरा नीला",
    mr: "शिस्त पाळा.", bn: "শৃঙ্খলা বজায় রাখুন।", gu: "શિસ્ત જાળવો.", ta: "ஒழுங்காக இருங்கள்.", te: "క్రమశిక్షణ పాటించండి.", kn: "ಶಿಸ್ತು ಪಾಲಿಸಿ.", ml: "ചിട്ട പാലിക്കുക."
  },
  "Libra": {
    en: "**General**: Seek harmony.\n**Career**: Balance work and life.\n**Love**: Harmony in relationships.\n**Lucky Color**: Pink",
    hi: "**सामान्य**: सामंजस्य खोजें।\n**करियर**: काम और जीवन में संतुलन।\n**प्रेम**: रिश्तों में सामंजस्य।\n**शुभ रंग**: गुलाबी",
    mr: "समतोल राखा.", bn: "ভারসাম্য বজায় রাখুন।", gu: "સંતુલન જાળવો.", ta: "சமநிலை காக்கவும்.", te: "సమతుల్యత పాటించండి.", kn: "ಸಮತೋಲನ ಕಾಪಾಡಿ.", ml: "സന്തുലിതാവസ്ഥ പാലിക്കുക."
  },
  "Scorpio": {
    en: "**General**: Transformation day.\n**Career**: Research and dig deep.\n**Love**: Deep connections.\n**Lucky Color**: Maroon",
    hi: "**सामान्य**: परिवर्तन का दिन।\n**करियर**: गहरा शोध करें।\n**प्रेम**: गहरे संबंध।\n**शुभ रंग**: मैरून",
    mr: "बदल स्वीकारा.", bn: "পরিবর্তন মেনে নিন।", gu: "પરિવર્તન સ્વીકારો.", ta: "മാറ്റം സ്വീകരിക്കുക.", te: "മാറ്റം സ്വീകരിക്കുക.", kn: "ಬದಲಾವಣೆಯನ್ನು ಸ್ವೀಕರಿಸಿ.", ml: "മാറ്റം സ്വീകരിക്കുക."
  },
  "Sagittarius": {
    en: "**General**: Adventure awaits.\n**Career**: Learn something new.\n**Love**: Fun times ahead.\n**Lucky Color**: Yellow",
    hi: "**सामान्य**: रोमांच इंतज़ार कर रहा है।\n**करियर**: कुछ नया सीखें।\n**प्रेम**: मज़ेदार समय।\n**शुभ रंग**: पीला",
    mr: "प्रवास करा.", bn: "ভ্রমণ করুন।", gu: "પ્રવાસ કરો.", ta: "பயணம் செய்யுங்கள்.", te: "ప్రయాణం చేయండి.", kn: "ಪ್ರಯಾಣ ಮಾಡಿ.", ml: "യാത്ര ചെയ്യുക."
  },
  "Capricorn": {
    en: "**General**: Hard work pays off.\n**Career**: Focus on goals.\n**Love**: Serious commitment.\n**Lucky Color**: Black",
    hi: "**सामान्य**: मेहनत रंग लाएगी।\n**करियर**: लक्ष्यों पर ध्यान दें।\n**प्रेम**: गंभीर प्रतिबद्धता।\n**शुभ रंग**: काला",
    mr: "कष्ट करा.", bn: "পরিশ্রম করুন।", gu: "મહેનત કરો.", ta: "உழைக்கவும்.", te: "కష్టపడండి.", kn: "ಶ್ರಮಿಸಿ.", ml: "കഠിനാധ്വാനം ചെയ്യുക."
  },
  "Aquarius": {
    en: "**General**: Innovation day.\n**Career**: Think outside the box.\n**Love**: Unique connections.\n**Lucky Color**: Electric Blue",
    hi: "**सामान्य**: नवाचार का दिन।\n**करियर**: कुछ अलग सोचें।\n**प्रेम**: अनोखे संबंध।\n**शुभ रंग**: इलेक्ट्रिक नीला",
    mr: "नवीन विचार करा.", bn: "নতুন চিন্তা করুন।", gu: "નવો વિચાર કરો.", ta: "புதிய சிந்தனை.", te: "కొత్తగా ఆలోచించండి.", kn: "ಹೊಸದಾಗಿ ಯೋಚಿಸಿ.", ml: "പുതിയ ചിന്തകൾ."
  },
  "Pisces": {
    en: "**General**: Dream big.\n**Career**: Creative arts.\n**Love**: Spiritual bond.\n**Lucky Color**: Sea Green",
    hi: "**सामान्य**: बड़े सपने देखें।\n**करियर**: रचनात्मक कला।\n**प्रेम**: आध्यात्मिक बंधन।\n**शुभ रंग**: समुद्री हरा",
    mr: "स्वप्न पहा.", bn: "স্বপ্ন দেখুন।", gu: "સ્વપ્ન જુઓ.", ta: "கனவு காணுங்கள்.", te: "కలలు కనండి.", kn: "ಕನಸು ಕಾಣಿ.", ml: "സ്വപ്നം കാണുക."
  }
};

export const getLocalDailyRashifal = (signName: string, lang: Language): string => {
  // Map sign name to DB key if needed, assuming exact match for English keys
  // For safety, default to English if translation missing
  const entry = HOROSCOPE_DB[signName];
  if (!entry) return "Prediction not available for this sign.";
  
  return entry[lang] || entry['en'];
};

// Simple Panchang Algorithm (Approximation based on Date)
export const getLocalPanchang = (dateStr: string, location: string, lang: Language): string => {
  const date = new Date(dateStr);
  
  // Deterministic Mock Data Generation based on date
  const tithis = ["Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami", "Shukla Shashthi", "Krishna Pratipada", "Krishna Amavasya"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu"];
  
  const dayIndex = date.getDate() % tithis.length;
  const nakIndex = (date.getDate() + date.getMonth()) % nakshatras.length;
  
  const tithi = tithis[dayIndex];
  const nakshatra = nakshatras[nakIndex];
  
  const content = {
    en: `**Date**: ${date.toDateString()}\n**Location**: ${location}\n\n* **Tithi**: ${tithi}\n* **Nakshatra**: ${nakshatra}\n* **Sunrise**: 06:15 AM\n* **Sunset**: 06:45 PM\n* **Abhijit Muhurat**: 11:45 AM - 12:30 PM\n* **Rahu Kaal**: 03:00 PM - 04:30 PM`,
    hi: `**दिनांक**: ${date.toLocaleDateString()}\n**स्थान**: ${location}\n\n* **तिथि**: ${tithi}\n* **नक्षत्र**: ${nakshatra}\n* **सूर्योदय**: 06:15 AM\n* **सूर्यास्त**: 06:45 PM\n* **अभिजीत मुहूर्त**: 11:45 AM - 12:30 PM\n* **राहु काल**: 03:00 PM - 04:30 PM`
  };
  
  return lang === 'hi' ? content.hi : content.en;
};