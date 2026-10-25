
import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { getPanchang } from '../services/geminiService';
import { t } from '../services/translations';
import { downloadPDF } from '../services/pdfService';
import ReactMarkdown from 'react-markdown';
import { Sun, Calendar, MapPin, ArrowLeft, Loader, Download } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

export const Panchang: React.FC<Props> = ({ lang, onBack }) => {
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('New Delhi, India');

  useEffect(() => {
    const fetchPanchang = async () => {
        setLoading(true);
        try {
            const today = new Date().toDateString();
            const text = await getPanchang(today, location, lang);
            setData(text);
        } catch (e) {
            setData("Unable to fetch Panchang.");
        } finally {
            setLoading(false);
        }
    };
    
    fetchPanchang();
  }, [lang, location]);

  const handleDownload = () => {
      downloadPDF('panchang-report', `Panchang_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
       <div className="flex justify-between items-center mb-4">
           <button onClick={onBack} className="flex items-center text-saffron-400 hover:text-saffron-200">
            <ArrowLeft size={16} className="mr-1"/> Back
          </button>
          
          {!loading && data && (
            <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-saffron-900/30 border border-saffron-500/30 text-saffron-200 px-3 py-1.5 rounded-lg hover:bg-saffron-900/50 transition-colors text-sm"
            >
                <Download size={16} />
                <span>PDF</span>
            </button>
          )}
       </div>

      <div id="panchang-report" className="bg-maroon-900/60 backdrop-blur-md border border-saffron-900/30 rounded-2xl overflow-hidden shadow-2xl print:bg-white print:border-2 print:border-gray-400 print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-saffron-900/50 to-maroon-900/50 p-6 border-b border-saffron-900/30 flex justify-between items-center flex-wrap gap-4 print:bg-white print:border-b-2 print:border-gray-400">
           <div>
              <h2 className="text-2xl font-serif text-saffron-100 flex items-center gap-2 print:text-black">
                <Sun className="text-saffron-500 print:text-gray-700" /> {t('panchang', lang)}
              </h2>
              <p className="text-saffron-500/80 text-sm mt-1 flex items-center gap-1 print:text-gray-700">
                 <Calendar size={14} className="print:text-gray-600" /> {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {dateStyle: 'full'})}
              </p>
           </div>
           <div className="bg-black/30 px-3 py-1 rounded-full border border-saffron-900/50 flex items-center gap-2 text-saffron-300 text-xs print:bg-gray-100 print:border-gray-400 print:text-gray-700">
              <MapPin size={12} className="print:text-gray-600" /> {location}
           </div>
        </div>

        <div className="p-6 sm:p-8 min-h-[300px]">
             {loading ? (
                 <div className="flex flex-col items-center justify-center py-12 h-full">
                    <Loader className="w-10 h-10 text-saffron-400 animate-spin mb-4" />
                    <p className="text-saffron-200/80 font-serif animate-pulse">Calculating Tithi & Nakshatra...</p>
                 </div>
             ) : (
                 <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-saffron-300 prose-strong:text-saffron-200 print:prose print:text-gray-900 print:prose-headings:text-gray-900 print:prose-strong:text-gray-900">
                    <ReactMarkdown>{data}</ReactMarkdown>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
