
import React, { useState } from 'react';
import { Language, MatchMakingDetails } from '../types';
import { t } from '../services/translations';
import { fetchMatchMaking } from '../services/astrologyService';
import { downloadPDF } from '../services/pdfService';
import { Heart, ArrowLeft, User, MapPin, Calendar, Clock, Download } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

export const KundaliMatching: React.FC<Props> = ({ lang, onBack }) => {
  const [details, setDetails] = useState<MatchMakingDetails>({
    boyName: '', boyDate: '', boyTime: '', boyLocation: '',
    girlName: '', girlDate: '', girlTime: '', girlLocation: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const data = await fetchMatchMaking(details);
        setResult(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleDownload = () => {
    if (result) {
        downloadPDF('matching-report', `Matching_${details.boyName}_${details.girlName}.pdf`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
       <div className="flex justify-between items-center mb-4">
           <button onClick={onBack} className="flex items-center text-saffron-400 hover:text-saffron-200">
            <ArrowLeft size={16} className="mr-1"/> Back
          </button>
          
          {result && (
            <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-saffron-900/30 border border-saffron-500/30 text-saffron-200 px-3 py-1.5 rounded-lg hover:bg-saffron-900/50 transition-colors text-sm"
            >
                <Download size={16} />
                <span>PDF</span>
            </button>
          )}
       </div>

      {!result ? (
        <div className="bg-maroon-900/60 backdrop-blur-md border border-saffron-900/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Heart className="mx-auto text-red-500 mb-2 fill-red-500/20" size={40} />
            <h2 className="text-3xl font-serif text-saffron-100">{t('matching', lang)}</h2>
            <p className="text-saffron-600">{t('matching_desc', lang)}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-saffron-900 to-transparent"></div>
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-saffron-300 border-b border-saffron-900/50 pb-2">Boy's Details</h3>
              <InputGroup icon={<User/>} name="boyName" ph="Name" val={details.boyName} onChange={handleChange} />
              <InputGroup icon={<Calendar/>} name="boyDate" ph="Date (YYYY-MM-DD)" type="date" val={details.boyDate} onChange={handleChange} />
              <InputGroup icon={<Clock/>} name="boyTime" ph="Time" type="time" val={details.boyTime} onChange={handleChange} />
              <InputGroup icon={<MapPin/>} name="boyLocation" ph="City" val={details.boyLocation} onChange={handleChange} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-serif text-saffron-300 border-b border-saffron-900/50 pb-2">Girl's Details</h3>
               <InputGroup icon={<User/>} name="girlName" ph="Name" val={details.girlName} onChange={handleChange} />
              <InputGroup icon={<Calendar/>} name="girlDate" ph="Date (YYYY-MM-DD)" type="date" val={details.girlDate} onChange={handleChange} />
              <InputGroup icon={<Clock/>} name="girlTime" ph="Time" type="time" val={details.girlTime} onChange={handleChange} />
              <InputGroup icon={<MapPin/>} name="girlLocation" ph="City" val={details.girlLocation} onChange={handleChange} />
            </div>
            <div className="md:col-span-2 mt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-800 to-saffron-700 py-4 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-saffron-900/50 transition-all disabled:opacity-50"
              >
                {loading ? t('calculating', lang) : "Calculate Compatibility (Backend)"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div id="matching-report" className="bg-maroon-900/60 backdrop-blur-md border border-saffron-900/30 rounded-2xl p-8 shadow-2xl text-center print:bg-white print:border-2 print:border-gray-400 print:shadow-none print:rounded-none">
           <div className="mb-4 border-b border-saffron-900/30 pb-4 print:border-b-2 print:border-gray-400">
               <h3 className="text-xl font-serif text-saffron-200 print:text-black">{details.boyName} <span className="text-saffron-600 px-2 print:text-gray-600">&</span> {details.girlName}</h3>
           </div>

           <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-4 border-saffron-900/50 print:border-gray-400"></div>
               <div className="absolute inset-0 rounded-full border-4 border-saffron-500 border-t-transparent animate-[spin_3s_linear_infinite_reverse] print:border-gray-600 print:animate-none"></div>
               <div className="flex flex-col items-center">
                   <span className="text-3xl font-bold text-saffron-100 print:text-black">{result.score}</span>
                   <span className="text-xs text-saffron-500 print:text-gray-700">out of 36</span>
               </div>
           </div>

           <h2 className={`text-2xl font-serif mb-2 ${result.score > 18 ? 'text-green-400' : 'text-red-400'} print:text-black`}>
             Verdict: {result.verdict}
           </h2>
           <p className="text-saffron-200 mb-6 max-w-lg mx-auto print:text-gray-800">{result.description}</p>

           {result.nadi_dosha && (
               <div className="bg-red-900/30 border border-red-800/50 p-4 rounded-lg inline-block print:bg-red-50 print:border-red-200">
                   <p className="text-red-300 text-sm font-bold print:text-red-800">⚠️ Nadi Dosha Detected</p>
               </div>
           )}

           <div data-html2canvas-ignore>
             <button onClick={() => setResult(null)} className="mt-8 text-sm text-saffron-500 hover:text-saffron-300 underline print:hidden">Check Another</button>
           </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ icon, name, ph, type="text", val, onChange }: any) => (
  <div className="relative group">
    <div className="absolute left-3 top-3 text-saffron-600">{React.cloneElement(icon, {size: 18})}</div>
    <input 
      type={type} name={name} placeholder={ph} value={val} onChange={onChange} required
      className="w-full bg-black/40 border border-saffron-900/50 rounded-lg py-3 pl-10 text-saffron-100 focus:border-saffron-500 outline-none transition-colors placeholder-saffron-800/50"
    />
  </div>
);
