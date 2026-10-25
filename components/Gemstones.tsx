
import React, { useState } from 'react';
import { Language, BirthDetailsForm, ChartResponse } from '../types';
import { calculateGemstone } from '../services/gemstoneService';
import { fetchChartData } from '../services/astrologyService';
import { t } from '../services/translations';
import { downloadPDF } from '../services/pdfService';
import { InputForm } from './InputForm';
import { Diamond, ArrowLeft, Loader, Download, Edit2, RotateCcw, Gem, Shield, AlertTriangle } from 'lucide-react';

interface Props {
  lang: Language;
  onBack: () => void;
}

export const Gemstones: React.FC<Props> = ({ lang, onBack }) => {
  const [gemstoneData, setGemstoneData] = useState<any>(null);
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
        // First get chart data (Swiss Ephemeris)
        const chartData: ChartResponse = await fetchChartData(data);
        // Then calculate gemstone based on Lagna
        const gemData = calculateGemstone(chartData);
        setGemstoneData(gemData);
    } catch (e) {
        setGemstoneData(null);
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
    if (gemstoneData) {
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
        {gemstoneData && !showForm && (
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
                {gemstoneData && (
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

                {gemstoneData && !showForm && (
                    <div className="animate-fade-in" id="gemstones-report">
                         <div className="mb-6 pb-4 border-b border-saffron-900/30 print:border-b-2 print:border-gray-400">
                            <h3 className="text-2xl font-serif text-saffron-100 print:text-black">रत्न विवरण - {clientName}</h3>
                            <p className="text-saffron-500 text-sm print:text-gray-700">वैदिक ज्योतिष एवं स्विस एफेमेरिस पर आधारित (Based on Vedic Astrology & Swiss Ephemeris)</p>
                        </div>

                        {/* Life Stone */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">1. जीवन रत्न (Life Stone)</h4>
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-6 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <div className="flex items-center gap-3 mb-4">
                                <Gem className="text-saffron-500 print:text-gray-700" size={24} />
                                <h4 className="text-xl font-serif text-saffron-200 print:text-black">जीवन रत्न (Life Stone)</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">रत्न (Gemstone)</p>
                                    <p className="text-saffron-100 font-semibold print:text-black">{gemstoneData.lifeStone.name}</p>
                                    <p className="text-saffron-500 text-sm print:text-gray-600">{gemstoneData.lifeStone.hindiName}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">शासक ग्रह (Ruling Planet)</p>
                                    <p className="text-saffron-100 font-semibold print:text-black">{gemstoneData.lifeStone.planet}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">धातु (Metal)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lifeStone.metal}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">अंगुली (Finger)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lifeStone.finger}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">दिन (Day)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lifeStone.day}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">रंग (Color)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lifeStone.color}</p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-saffron-900/30 rounded-lg print:bg-gray-100 print:border print:border-gray-400">
                                <p className="text-saffron-400 text-sm mb-1 print:text-gray-700">मंत्र (Mantra)</p>
                                <p className="text-saffron-200 text-sm print:text-black">{gemstoneData.lifeStone.mantra}</p>
                            </div>
                        </div>

                        {/* Lagna Info */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">2. लग्न विवरण (Lagna Information)</h4>
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-saffron-400 print:text-gray-700">लग्न राशि (Lagna Sign)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lagnaSign}</p>
                                </div>
                                <div>
                                    <p className="text-saffron-400 print:text-gray-700">लग्नेश (Lagna Lord)</p>
                                    <p className="text-saffron-100 print:text-black">{gemstoneData.lagnaLord}</p>
                                </div>
                            </div>
                        </div>

                        {/* Suitability Check */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">3. उपयुक्तता जांच (Suitability Check)</h4>
                        <div className={`border rounded-xl p-4 mb-6 print:rounded-lg print:border-2 ${
                            gemstoneData.suitability.risk === 'Low' ? 'bg-green-900/20 border-green-500/30 print:bg-green-100 print:border-green-500' :
                            gemstoneData.suitability.risk === 'Medium' ? 'bg-yellow-900/20 border-yellow-500/30 print:bg-yellow-100 print:border-yellow-500' :
                            'bg-red-900/20 border-red-500/30 print:bg-red-100 print:border-red-500'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {gemstoneData.suitability.risk === 'Low' ? (
                                    <Shield className="text-green-400 print:text-green-700" size={20} />
                                ) : (
                                    <AlertTriangle className="text-yellow-400 print:text-yellow-700" size={20} />
                                )}
                                <h4 className="text-saffron-200 font-serif print:text-black">उपयुक्तता स्कोर (Suitability Score)</h4>
                            </div>
                            <div className="mb-2">
                                <p className="text-saffron-400 text-sm print:text-gray-700">स्कोर (Score): {gemstoneData.suitability.score}/100</p>
                                <div className="w-full bg-saffron-900/50 rounded-full h-2 mt-1 print:bg-gray-300">
                                    <div className={`h-2 rounded-full ${
                                        gemstoneData.suitability.score >= 70 ? 'bg-green-500' :
                                        gemstoneData.suitability.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} style={{ width: `${gemstoneData.suitability.score}%` }}></div>
                                </div>
                            </div>
                            <p className="text-saffron-100/90 text-sm print:text-gray-800">{gemstoneData.suitability.verdict}</p>
                            <p className="text-saffron-400 text-xs mt-1 print:text-gray-600">जोखिम स्तर (Risk Level): {gemstoneData.suitability.risk}</p>
                        </div>

                        {/* Uparatna */}
                        {gemstoneData.uparatna.length > 0 && (
                            <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">4. उपरत्न (Uparatna)</h4>
                        )}
                        {gemstoneData.uparatna.length > 0 && (
                            <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                                <h4 className="text-saffron-200 font-serif mb-3 print:text-black">वैकल्पिक रत्न (Alternative Gemstones)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {gemstoneData.uparatna.map((stone: string) => (
                                        <span key={stone} className="px-3 py-1 bg-saffron-800/50 text-saffron-200 rounded-full text-sm print:bg-gray-200 print:text-gray-900 print:border print:border-gray-400">
                                            {stone}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-saffron-400 text-xs mt-2 print:text-gray-600">* Uparatna are lighter alternatives. Weight should be 2-3x more than main stone.</p>
                            </div>
                        )}

                        {/* Wearing Instructions */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">5. धारण विधि (Wearing Instructions)</h4>
                        <div className="bg-saffron-900/20 border border-saffron-500/30 rounded-xl p-4 mb-6 print:bg-white print:border-2 print:border-gray-400 print:shadow-none">
                            <h4 className="text-saffron-200 font-serif mb-3 print:text-black">धारण विधि (Wearing Instructions)</h4>
                            <ul className="space-y-2 text-sm text-saffron-100/90 print:text-gray-800">
                                {gemstoneData.wearingInstructions.map((instruction: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-saffron-500 print:text-gray-600">•</span>
                                        <span>{instruction}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Precautions */}
                        <h4 className="text-lg font-serif text-saffron-400 mb-3 print:text-black">6. सावधानियाँ (Precautions)</h4>
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 print:bg-red-50 print:border-2 print:border-red-400 print:shadow-none">
                            <h4 className="text-red-300 font-serif mb-3 print:text-red-900">महत्वपूर्ण सावधानियाँ (Important Precautions)</h4>
                            <ul className="space-y-2 text-sm text-saffron-100/90 print:text-gray-800">
                                {gemstoneData.precautions.map((precaution: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-red-400 print:text-red-700">⚠</span>
                                        <span>{precaution}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
