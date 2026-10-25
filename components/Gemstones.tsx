
import React, { useState } from 'react';
import { Language, BirthDetailsForm } from '../types';
import { getGemstoneRecommendation } from '../services/geminiService';
import { t } from '../services/translations';
import { downloadPDF } from '../services/pdfService';
import { InputForm } from './InputForm';
import ReactMarkdown from 'react-markdown';
import { Diamond, ArrowLeft, Loader, Download, Edit2, RotateCcw } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

export const Gemstones: React.FC<Props> = ({ lang, onBack }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  // Store details to enable edit mode
  const [formData, setFormData] = useState<BirthDetailsForm | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (data: BirthDetailsForm) => {
    setFormData(data);
    setLoading(true);
    setClientName(data.name);
    setShowForm(false);
    try {
        const text = await getGemstoneRecommendation(data, lang);
        setReport(text);
    } catch (e) {
        setReport("Unable to fetch gemstone recommendations.");
    } finally {
        setLoading(false);
    }
  };

  const handleEdit = () => {
     setReport('');
     setShowForm(true);
     // formData is already set, will be passed to InputForm
  };

  const handleNew = () => {
     setReport('');
     setFormData(null);
     setShowForm(true);
  };

  const handleDownload = () => {
    if (report) {
        downloadPDF('gemstones-report', `Gemstones_${clientName}.pdf`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-10">
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

      <div className="grid md:grid-cols-12 gap-8">
         <div className="md:col-span-12 bg-maroon-900/60 backdrop-blur-md border border-saffron-900/30 rounded-2xl overflow-hidden shadow-2xl print:bg-white print:border-2 print:border-gray-400 print:shadow-none print:rounded-none">
            <div className="p-6 border-b border-saffron-900/30 bg-black/20 flex justify-between items-center print:bg-white print:border-b-2 print:border-gray-400">
                <div>
                    <h2 className="text-2xl font-serif text-saffron-100 flex items-center gap-2 print:text-black">
                        <Diamond className="text-saffron-500 print:text-gray-700" /> {t('gemstones', lang)}
                    </h2>
                    <p className="text-saffron-600 text-sm mt-1 print:text-gray-700">{t('gemstones_desc', lang)}</p>
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
                {showForm && !loading && (
                    <div className="flex flex-col items-center print:hidden">
                        <p className="text-saffron-200/80 mb-8 text-center max-w-xl">
                            Gemstones are powerful cosmic amplifiers. To recommend the correct Life Stone and Lucky Stone, we need your precise birth chart details to analyze your Ascendant (Lagna) and Planetary positions.
                        </p>
                        <InputForm
                            onSubmit={handleSubmit}
                            isLoading={loading}
                            lang={lang}
                            initialValues={formData}
                        />
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 print:hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-saffron-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                            <Diamond className="w-16 h-16 text-saffron-400 animate-bounce relative z-10" />
                        </div>
                        <p className="text-saffron-200/80 font-serif mt-6 animate-pulse text-lg">Analyzing planetary vibrations...</p>
                    </div>
                )}

                {report && !showForm && (
                    <div className="animate-fade-in" id="gemstones-report">
                         <div className="mb-4 pb-4 border-b border-saffron-900/30 print:border-b-2 print:border-gray-400">
                            <h3 className="text-xl font-serif text-saffron-100 print:text-black">Recommendation for {clientName}</h3>
                        </div>
                        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-saffron-200 prose-p:text-saffron-100/90 prose-strong:text-saffron-300 prose-li:text-saffron-100/80 print:prose print:text-gray-900 print:prose-headings:text-gray-900 print:prose-p:text-gray-800 print:prose-strong:text-gray-900 print:prose-li:text-gray-800">
                            <ReactMarkdown>{report}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
