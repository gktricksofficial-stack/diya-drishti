
import React, { useState } from 'react';
import { Language } from '../types';
import { getNumerologyReport } from '../services/geminiService';
import { t } from '../services/translations';
import { downloadPDF } from '../services/pdfService';
import ReactMarkdown from 'react-markdown';
import { Calculator, ArrowLeft, Loader, User, Calendar, Download, Edit2, RotateCcw } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

export const Numerology: React.FC<Props> = ({ lang, onBack }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowForm(false);
    try {
        const text = await getNumerologyReport(name, date, lang);
        setReport(text);
    } catch (e) {
        setReport("Unable to fetch report.");
    } finally {
        setLoading(false);
    }
  };

  const handleEdit = () => {
    setReport('');
    setShowForm(true);
  };

  const handleNew = () => {
    setReport('');
    setName('');
    setDate('');
    setShowForm(true);
  };

  const handleDownload = () => {
      if (report) {
          downloadPDF('numerology-report', `Numerology_${name.replace(/\s/g, '_')}.pdf`);
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center text-saffron-400 hover:text-saffron-200">
            <ArrowLeft size={16} className="mr-1"/> Back
        </button>

         {/* Action Bar */}
         {report && !showForm && (
            <div className="flex gap-2">
                 <button 
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-900/20 border border-saffron-500/30 text-saffron-300 hover:bg-saffron-900/40 text-sm transition-colors"
                  >
                    <Edit2 size={14} /> Edit Details
                  </button>
                  <button 
                    onClick={handleNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-900/20 border border-saffron-500/30 text-saffron-300 hover:bg-saffron-900/40 text-sm transition-colors"
                  >
                     <RotateCcw size={14} /> New Check
                  </button>
            </div>
        )}
      </div>

      <div className="bg-maroon-900/60 backdrop-blur-md border border-saffron-900/30 rounded-2xl overflow-hidden shadow-2xl print:bg-white print:border-2 print:border-gray-400 print:shadow-none print:rounded-none">
        <div className="p-6 border-b border-saffron-900/30 bg-black/20 flex justify-between items-center print:bg-white print:border-b-2 print:border-gray-400">
            <div>
                <h2 className="text-2xl font-serif text-saffron-100 flex items-center gap-2 print:text-black">
                    <Calculator className="text-saffron-500 print:text-gray-700" /> {t('numerology', lang)}
                </h2>
                <p className="text-saffron-600 text-sm mt-1 print:text-gray-700">{t('numerology_desc', lang)}</p>
            </div>
            {report && (
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-saffron-900/30 border border-saffron-500/30 text-saffron-200 px-3 py-1.5 rounded-lg hover:bg-saffron-900/50 transition-colors text-sm print:hidden"
                >
                    <Download size={16} />
                    <span className="hidden sm:inline">PDF</span>
                </button>
            )}
        </div>

        <div className="p-6 md:p-8">
            {showForm ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 print:hidden">
                    <div className="space-y-2">
                        <label className="text-saffron-500 text-sm uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-saffron-600" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-black/40 border border-saffron-900/50 rounded-lg py-3 pl-10 text-saffron-100 focus:border-saffron-500 outline-none"
                                placeholder="Enter name as on official documents"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-saffron-500 text-sm uppercase tracking-wider">Date of Birth</label>
                         <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-saffron-600" size={18} />
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-black/40 border border-saffron-900/50 rounded-lg py-3 pl-10 text-saffron-100 focus:border-saffron-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-saffron-700 to-red-800 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-saffron-500/20 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Analyzing Numbers...' : 'Generate Numerology Report'}
                    </button>
                </form>
            ) : (
                <div className="animate-fade-in" id="numerology-report">
                    <div className="mb-4 pb-4 border-b border-saffron-900/30 print:border-b-2 print:border-gray-400">
                        <h3 className="text-xl font-serif text-saffron-100 print:text-black">{name}</h3>
                        <p className="text-saffron-500 text-sm print:text-gray-700">DOB: {date}</p>
                    </div>
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-saffron-200 prose-p:text-saffron-100/90 prose-strong:text-saffron-300 prose-li:text-saffron-100/80 print:prose print:text-gray-900 print:prose-headings:text-gray-900 print:prose-p:text-gray-800 print:prose-strong:text-gray-900 print:prose-li:text-gray-800">
                        <ReactMarkdown>{report}</ReactMarkdown>
                    </div>
                </div>
            )}

            {loading && !report && (
                 <div className="flex flex-col items-center justify-center py-12">
                    <Loader className="w-10 h-10 text-saffron-400 animate-spin mb-4" />
                    <p className="text-saffron-200/80 font-serif animate-pulse">Calculating Life Path & Destiny Numbers...</p>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};
