
import React, { useState } from 'react';
import { Language } from '../types';
import { RASHIS, t } from '../services/translations';
import { getDailyRashifal } from '../services/geminiService';
import { downloadPDF } from '../services/pdfService';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ArrowLeft, Loader, Download } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

// Custom SVG Paths for Hindu Rashi Symbols
const ZODIAC_PATHS: Record<string, React.ReactNode> = {
  Aries: <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 0v5m-5-6c-1.5 0-3.5-1-4-4m13 4c1.5 0 3.5-1 4-4" />,
  Taurus: <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M4 6c0 4 3 6 8 6s8-2 8-6" />,
  Gemini: <path d="M8 4v16M16 4v16M5 6c2-2 6-2 8 0c2-2 6-2 8 0M5 18c2 2 6 2 8 0c2 2 6 2 8 0" />,
  Cancer: <path d="M6 12a6 6 0 1 0 9 0 3 3 0 1 0-3-3 M18 12a6 6 0 1 1-9 0 3 3 0 1 1 3 3" />,
  Leo: <path d="M6 16a3 3 0 1 0 3-3h1a4 4 0 0 1 4-4 4 4 0 0 1 0 8 4 4 0 0 0 4 4" />,
  Virgo: <path d="M5 6v12 M11 6v12 M17 6v7a5 5 0 0 1 4 5v1 M17 19c1.5 1.5 3-1 3-2" />,
  Libra: <path d="M12 3v5m0 13v-8m-7 0h14m-14 0l-3 6h6l-3-6m11 0l-3 6h6l-3-6" />,
  Scorpio: <path d="M5 6v12 M11 6v12 M17 6v12l3-3 3 3" />,
  Sagittarius: <path d="M12 3v18M12 3l-3 3M12 3l3 3M4 12a8 8 0 0 0 16 0" />,
  Capricorn: <path d="M4 10l4-4 3 3 M11 9v4a4 4 0 0 0 4 4 4 4 0 0 0 4-4" />,
  Aquarius: (
    <g>
        <path d="M8 9l2-5h4l2 5v2c0 3-2 6-6 6s-6-3-6-6v-2z" />
        <path d="M12 17v5M8 22h8" />
        <path d="M9 7h6" strokeOpacity="0.5"/>
    </g>
  ),
  Pisces: <path d="M12 6c-4 0-7 3-7 6s3 6 7 6 M12 6c4 0 7 3 7 6s-3 6-7 6 M5 12h14" />,
};

const ZodiacIcon = ({ name, className = "" }: { name: string, className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {ZODIAC_PATHS[name] || <circle cx="12" cy="12" r="10" />}
  </svg>
);

export const Rashifal: React.FC<Props> = ({ lang, onBack }) => {
  const [selectedSign, setSelectedSign] = useState<any | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSignClick = async (sign: any) => {
    setSelectedSign(sign);
    setLoading(true);
    setPrediction('');
    try {
        const text = await getDailyRashifal(sign.en, lang);
        setPrediction(text);
    } catch (e) {
        setPrediction("Error fetching horoscope. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleDownload = () => {
    if (selectedSign) {
        downloadPDF('rashifal-report', `${selectedSign.en}_Horoscope.pdf`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-saffron-400 hover:text-saffron-200 transition-colors group">
            <div className="p-2 rounded-full bg-saffron-900/20 group-hover:bg-saffron-900/40 mr-2 transition-colors">
                <ArrowLeft size={20} />
            </div> 
            <span className="font-serif">Back to Dashboard</span>
        </button>
        
        {selectedSign && !loading && prediction && (
            <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-saffron-900/30 border border-saffron-500/30 text-saffron-200 px-4 py-2 rounded-lg hover:bg-saffron-900/50 transition-colors"
            >
                <Download size={18} />
                <span className="text-sm font-bold">Download PDF</span>
            </button>
        )}
      </div>
      
      {!selectedSign ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {RASHIS.map((r) => (
            <div 
              key={r.en}
              onClick={() => handleSignClick(r)}
              className="group relative bg-gradient-to-br from-maroon-900/60 to-black/60 border border-saffron-900/30 hover:border-saffron-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,160,0,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-saffron-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 w-16 h-16 mb-4 flex items-center justify-center bg-saffron-900/20 rounded-full group-hover:bg-saffron-500/20 transition-colors duration-300 shadow-inner border border-saffron-900/10">
                <ZodiacIcon name={r.en} className="w-10 h-10 text-saffron-400 group-hover:text-saffron-200 transition-colors" />
              </div>
              <div className="relative z-10 text-center">
                  <h3 className="text-xl font-serif text-saffron-100 group-hover:text-white transition-colors">
                    {r[lang] || r['en']}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-saffron-600/70 group-hover:text-saffron-400 mt-1 font-sans">{r.en}</p>
              </div>
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shimmer pointer-events-none"></div>
            </div>
          ))}
        </div>
      ) : (
        <div id="rashifal-report" className="bg-gradient-to-b from-maroon-900/80 to-black/80 backdrop-blur-xl border border-saffron-900/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl print:bg-white print:border-2 print:border-gray-400 print:shadow-none print:rounded-none">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-8 border-b border-saffron-900/50 pb-8 print:border-b-2 print:border-gray-400">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-saffron-500/20 to-maroon-900/50 border-2 border-saffron-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,160,0,0.1)] print:bg-gray-100 print:border-gray-600 print:shadow-none">
                 <ZodiacIcon name={selectedSign.en} className="w-20 h-20 text-saffron-300 drop-shadow-[0_0_10px_rgba(255,200,0,0.3)] print:text-gray-800 print:drop-shadow-none" />
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-saffron-100 via-saffron-300 to-saffron-100 font-bold mb-2 print:text-black print:bg-none">
                  {selectedSign[lang] || selectedSign['en']}
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-900/30 border border-saffron-900/50 text-saffron-300/80 text-sm print:bg-gray-100 print:border-gray-400 print:text-gray-700">
                   <Sparkles size={14} className="print:text-gray-600" />
                   <span>{new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="min-h-[200px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                        <Loader className="w-10 h-10 text-saffron-400 animate-spin mb-4" />
                        <p className="text-saffron-200/80 font-serif animate-pulse">Consulting the Stars...</p>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-saffron-200 prose-p:text-saffron-100/90 prose-strong:text-saffron-300 print:prose print:text-gray-900 print:prose-headings:text-gray-900 print:prose-p:text-gray-800 print:prose-strong:text-gray-900">
                        <ReactMarkdown>{prediction}</ReactMarkdown>
                    </div>
                )}
            </div>
            
            <div data-html2canvas-ignore>
                <button 
                    onClick={() => setSelectedSign(null)}
                    className="mt-8 text-saffron-500 hover:text-saffron-300 underline text-sm"
                >
                    Check another sign
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
