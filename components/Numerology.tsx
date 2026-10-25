
import React, { useState } from 'react';
import { Language } from '../types';
import { calculateNumerology } from '../services/numerologyService';
import { t } from '../services/translations';
import { downloadPDF } from '../services/pdfService';
import { Calculator, ArrowLeft, Loader, User, Calendar, Download, Edit2, RotateCcw, Star, Sparkles } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

export const Numerology: React.FC<Props> = ({ lang, onBack }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [numerologyData, setNumerologyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowForm(false);
    try {
        const data = calculateNumerology(date, name);
        setNumerologyData(data);
    } catch (e) {
        setNumerologyData(null);
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
      if (numerologyData) {
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
         {numerologyData && !showForm && (
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
            {numerologyData && (
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
                    <div className="mb-6 pb-4 border-b border-saffron-900/30 print:border-b-2 print:border-gray-400">
                        <h3 className="text-2xl font-serif text-saffron-100 print:text-black">{name}</h3>
                        <p className="text-saffron-500 text-sm print:text-gray-700">DOB: {date}</p>
                    </div>

                    {/* Numbers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Mulank */}
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="text-saffron-500 print:text-gray-700" size={20} />
                                <h4 className="text-saffron-200 font-serif print:text-black">Mulank (Birth Number)</h4>
                            </div>
                            <div className="text-4xl font-bold text-saffron-100 mb-2 print:text-black">{numerologyData.mulank}</div>
                            <div className="text-sm text-saffron-400 space-y-1 print:text-gray-700">
                                <p><strong>Planet:</strong> {numerologyData.mulankPlanet}</p>
                                <p><strong>Color:</strong> {numerologyData.mulankColor}</p>
                                <p><strong>Day:</strong> {numerologyData.mulankDay}</p>
                            </div>
                        </div>

                        {/* Bhagyank */}
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="text-saffron-500 print:text-gray-700" size={20} />
                                <h4 className="text-saffron-200 font-serif print:text-black">Bhagyank (Destiny)</h4>
                            </div>
                            <div className="text-4xl font-bold text-saffron-100 mb-2 print:text-black">{numerologyData.bhagyank}</div>
                            <div className="text-sm text-saffron-400 space-y-1 print:text-gray-700">
                                <p><strong>Planet:</strong> {numerologyData.bhagyankPlanet}</p>
                                <p><strong>Color:</strong> {numerologyData.bhagyankColor}</p>
                                <p><strong>Day:</strong> {numerologyData.bhagyankDay}</p>
                            </div>
                        </div>

                        {/* Naamank */}
                        {numerologyData.naamank && (
                            <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calculator className="text-saffron-500 print:text-gray-700" size={20} />
                                    <h4 className="text-saffron-200 font-serif print:text-black">Naamank (Name)</h4>
                                </div>
                                <div className="text-4xl font-bold text-saffron-100 mb-2 print:text-black">{numerologyData.naamank}</div>
                                <div className="text-sm text-saffron-400 print:text-gray-700">
                                    <p className="font-semibold">Based on Chaldean system</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lucky Dates */}
                    <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                        <h4 className="text-saffron-200 font-serif mb-3 print:text-black">Lucky Dates (Birth Dates)</h4>
                        <div className="flex flex-wrap gap-2">
                            {numerologyData.luckyDates.map((date: number) => (
                                <span key={date} className="px-3 py-1 bg-saffron-800/50 text-saffron-200 rounded-full text-sm print:bg-gray-200 print:text-gray-900 print:border print:border-gray-400">
                                    {date}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Interpretations */}
                    <div className="space-y-4">
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <h4 className="text-saffron-200 font-serif mb-2 print:text-black">Mulank Interpretation</h4>
                            <p className="text-saffron-100/90 text-sm leading-relaxed print:text-gray-800">{numerologyData.interpretation.mulank}</p>
                        </div>

                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <h4 className="text-saffron-200 font-serif mb-2 print:text-black">Bhagyank Interpretation</h4>
                            <p className="text-saffron-100/90 text-sm leading-relaxed print:text-gray-800">{numerologyData.interpretation.bhagyank}</p>
                        </div>

                        {numerologyData.interpretation.naamank && (
                            <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                                <h4 className="text-saffron-200 font-serif mb-2 print:text-black">Naamank Interpretation</h4>
                                <p className="text-saffron-100/90 text-sm leading-relaxed print:text-gray-800">{numerologyData.interpretation.naamank}</p>
                            </div>
                        )}
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
