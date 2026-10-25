
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Logo } from './components/Logo';
import { Auth } from './components/Auth';
import { InputForm } from './components/InputForm';
import { ChartDisplay } from './components/ChartDisplay';
import { ChatInterface } from './components/ChatInterface';
import { Profile } from './components/Profile';
import { Rashifal } from './components/Rashifal';
import { Panchang } from './components/Panchang';
import { KundaliMatching } from './components/KundaliMatching';
import { Numerology } from './components/Numerology';
import { Gemstones } from './components/Gemstones';
import { LanguageSwitch } from './components/LanguageSwitch';
import { CosmicBackground } from './components/CosmicBackground';
import { PremiumModal } from './components/PremiumModal';
import { GlobalAssistant } from './components/GlobalAssistant';
import { UserProfile, BirthDetailsForm, ChartResponse, AppView, Language } from './types';
import { fetchChartData } from './services/astrologyService';
import { saveUserChart, saveFeedback } from './services/dbService';
import { downloadPDF } from './services/pdfService';
import { t } from './services/translations';
import { 
  User, LogOut, LayoutDashboard, Sparkles, ScrollText, Heart, Calculator, 
  Calendar as CalendarIcon, ArrowLeft, Lock, ShieldCheck, UserCheck, 
  Facebook, Instagram, Youtube, Smartphone, X, Mail, Send, Diamond, Copy, Check,
  Edit2, RotateCcw, Crown
} from 'lucide-react';

const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    content: `Effective Date: February 25, 2025

1. Introduction
Divya Drishti ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we handle your data when you use our application.

2. Information We Collect
- Birth Details: Date, time, and place of birth are required to generate astrological charts.
- Account Info: Email address and display name for user authentication.
- Usage Data: Information about how you interact with our tools.

3. How We Use Your Data
- To calculate and generate accurate Kundali, Horoscope, and Matchmaking reports.
- To provide AI-driven astrological insights via our Oracle.
- To maintain your history of consultations for your convenience.

4. Data Sharing
We do not sell your personal data. Birth data is processed securely and is strictly confidential.

5. Security
We implement enterprise-grade security measures to protect your data from unauthorized access.`
  },
  terms: {
    title: "Terms of Service",
    content: `1. Acceptance of Terms
By accessing Divya Drishti, you agree to be bound by these Terms of Service.

2. Service Description
Divya Drishti provides astrological calculations and AI-generated insights based on Vedic astrology principles.

3. User Conduct
You agree to use the service for lawful purposes only. You are responsible for maintaining the confidentiality of your account.

4. Intellectual Property
All content, algorithms, and designs are the property of Divya Drishti.

5. Termination
We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any breach of these Terms.`
  },
  refund: {
    title: "Refund Policy",
    content: `1. Digital Services
Divya Drishti provides digital content and instant calculations. Generally, fees paid for premium reports or services are non-refundable once the service has been delivered.

2. Exceptions
If a technical failure prevents the delivery of your report, or if the report contains gross technical errors due to system malfunction, you may request a refund within 7 days of purchase.

3. Contact
For refund requests, please contact our support team with your transaction ID.`
  },
  disclaimer: {
    title: "Disclaimer",
    content: `1. For Entertainment & Guidance Only
The astrological reports and AI insights provided by Divya Drishti are for entertainment and spiritual guidance purposes only.

2. Not Professional Advice
Our services do not constitute medical, legal, financial, or psychological advice. You should not rely on these predictions to make significant life decisions.

3. Accuracy
While we use high-precision algorithms (Swiss Ephemeris) for planetary calculations, astrological interpretation is subjective.

4. Limitation of Liability
Divya Drishti and its developers shall not be held liable for any direct, indirect, or consequential damages arising from the use of our services.`
  }
};

const LegalModal: React.FC<{ title: string; content: string; onClose: () => void }> = ({ title, content, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
    <div className="bg-maroon-900 border border-saffron-900/50 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
       <div className="flex justify-between items-center p-6 border-b border-saffron-900/30 bg-black/20 rounded-t-2xl">
          <h3 className="text-2xl font-serif text-saffron-100">{title}</h3>
          <button onClick={onClose} className="text-saffron-500 hover:text-red-400 transition-colors bg-saffron-900/10 p-2 rounded-full hover:bg-saffron-900/30">
            <X size={24}/>
          </button>
       </div>
       <div className="p-8 overflow-y-auto custom-scrollbar text-saffron-100/90 leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base">
          {content}
       </div>
       <div className="p-4 border-t border-saffron-900/30 bg-black/20 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-saffron-900/40 border border-saffron-700/50 text-saffron-200 rounded-lg hover:bg-saffron-900/60 transition-colors">
            Close
          </button>
       </div>
    </div>
  </div>
);

type SupportType = 'contact' | 'astrologer' | 'feedback';

const SupportModal: React.FC<{ type: SupportType; onClose: () => void }> = ({ type, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (type === 'astrologer') {
            // Fake login simulation for astrologers
            setSubmitted(true);
            return;
        }

        setIsSaving(true);
        try {
            if (type === 'feedback') {
                await saveFeedback('feedback', message);
            }
            setSubmitted(true);
        } catch (e) {
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText("contact.divyadrishtiapp@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderContent = () => {
        if (submitted && type === 'feedback') {
            return (
                <div className="text-center py-8 animate-fade-in">
                    <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                        <Send className="text-green-400" size={32} />
                    </div>
                    <h3 className="text-xl font-serif text-saffron-100 mb-2">Message Sent</h3>
                    <p className="text-saffron-600">Thank you for your feedback. We value your insights.</p>
                </div>
            );
        }

        switch (type) {
            case 'contact':
                return (
                    <div className="space-y-6">
                        <div className="bg-black/30 border border-saffron-900/30 rounded-xl p-6 text-center">
                            <Mail className="mx-auto text-saffron-500 mb-4" size={40} />
                            <h4 className="text-lg font-serif text-saffron-200 mb-2">Email Us</h4>
                            <p className="text-saffron-600/80 mb-4 text-sm">Copy our support email address:</p>
                            
                            <div className="flex items-center gap-2 bg-saffron-900/20 border border-saffron-900/50 rounded-lg p-2 relative group">
                                <input 
                                    type="text" 
                                    value="contact.divyadrishtiapp@gmail.com" 
                                    readOnly 
                                    className="bg-transparent text-saffron-200 w-full text-center outline-none font-medium" 
                                />
                                <button 
                                    onClick={handleCopy}
                                    className="absolute right-2 p-1.5 text-saffron-500 hover:text-saffron-200 bg-saffron-900/40 hover:bg-saffron-900/60 rounded-md transition-colors"
                                    title="Copy to Clipboard"
                                >
                                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                            
                            <p className="text-saffron-600/60 text-sm mt-4">
                                Our support team typically responds within 24 hours.
                            </p>
                        </div>
                    </div>
                );
            case 'astrologer':
                return (
                   <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-saffron-900/10 border border-saffron-500/20 p-4 rounded-lg mb-4">
                             <p className="text-saffron-300 text-sm text-center">Restricted Access: Authorized Personnel Only</p>
                        </div>
                        <div>
                            <label className="block text-saffron-600 text-xs uppercase tracking-widest mb-1">Astrologer ID</label>
                            <input 
                                type="text" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-saffron-900/50 rounded-lg p-3 text-saffron-100 focus:border-saffron-500 outline-none"
                                required 
                            />
                        </div>
                        <div>
                             <label className="block text-saffron-600 text-xs uppercase tracking-widest mb-1">Passkey</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-saffron-900/50 rounded-lg p-3 text-saffron-100 focus:border-saffron-500 outline-none"
                                required 
                            />
                        </div>
                        <button type="submit" className="w-full bg-saffron-700 hover:bg-saffron-600 text-maroon-900 font-bold py-3 rounded-lg transition-colors mt-4">
                            Login to Portal
                        </button>
                        {submitted && <p className="text-red-400 text-sm text-center animate-pulse">Access Denied: Invalid Credentials</p>}
                   </form>
                );
            case 'feedback':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label className="block text-saffron-600 text-xs uppercase tracking-widest mb-1">Your Message</label>
                            <textarea 
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="w-full h-32 bg-black/40 border border-saffron-900/50 rounded-lg p-3 text-saffron-100 focus:border-saffron-500 outline-none resize-none"
                                placeholder="Share your thoughts, suggestions, or report issues..."
                                required
                            />
                         </div>
                         <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full bg-saffron-700 hover:bg-saffron-600 text-maroon-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                         >
                            {isSaving ? 'Sending...' : 'Submit Feedback'}
                        </button>
                    </form>
                );
        }
    };

    const titles: Record<SupportType, string> = {
        contact: "Contact Support",
        astrologer: "Astrologer Login",
        feedback: "Send Feedback"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-maroon-900 border border-saffron-900/50 rounded-2xl w-full max-w-md flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-saffron-900/30 bg-black/20 rounded-t-2xl">
                    <h3 className="text-xl font-serif text-saffron-100">{titles[type]}</h3>
                    <button onClick={onClose} className="text-saffron-500 hover:text-red-400 transition-colors">
                        <X size={24}/>
                    </button>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

interface PaymentConfig {
    type: 'subscription' | 'one-time';
    amount?: number;
    title?: string;
    description?: string;
    onSuccess: () => void;
}

const Footer: React.FC<{ lang: Language, onNavigate: (view: AppView) => void }> = ({ lang, onNavigate }) => {
    const [legalInfo, setLegalInfo] = useState<{ title: string; content: string } | null>(null);
    const [supportModal, setSupportModal] = useState<SupportType | null>(null);

    return (
        <>
            <footer className="mt-12 border-t border-saffron-900/30 bg-black/40 pt-10 pb-6 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Logo size="sm" />
                                <span className="font-serif text-lg font-bold text-saffron-200">{t('app_name', lang)}</span>
                            </div>
                            <p className="text-saffron-600/60 text-sm leading-relaxed max-w-xs">
                                Unlocking the cosmic code of your destiny through Vedic wisdom and modern AI.
                            </p>
                            <div className="flex gap-4">
                                <button className="text-saffron-600 hover:text-saffron-400 transition-colors"><Facebook size={18}/></button>
                                <button className="text-saffron-600 hover:text-saffron-400 transition-colors"><Instagram size={18}/></button>
                                <button className="text-saffron-600 hover:text-saffron-400 transition-colors"><Youtube size={18}/></button>
                            </div>
                        </div>

                        {/* Features Links */}
                        <div>
                            <h4 className="font-serif text-saffron-300 mb-4">Features</h4>
                            <ul className="space-y-2 text-sm text-saffron-600/80">
                                <li><button onClick={() => onNavigate('kundali')} className="hover:text-saffron-400 transition-colors text-left">Janampatri</button></li>
                                <li><button onClick={() => onNavigate('rashifal')} className="hover:text-saffron-400 transition-colors text-left">Daily Horoscope</button></li>
                                <li><button onClick={() => onNavigate('matching')} className="hover:text-saffron-400 transition-colors text-left">Matchmaking</button></li>
                                <li><button onClick={() => onNavigate('panchang')} className="hover:text-saffron-400 transition-colors text-left">Panchang</button></li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="font-serif text-saffron-300 mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-saffron-600/80">
                                <li><button onClick={() => setSupportModal('contact')} className="hover:text-saffron-400 transition-colors text-left">Contact Us</button></li>
                                <li><button onClick={() => setSupportModal('feedback')} className="hover:text-saffron-400 transition-colors text-left">Feedback</button></li>
                                <li><button onClick={() => setSupportModal('astrologer')} className="hover:text-saffron-400 transition-colors text-left">Astrologer Login</button></li>
                            </ul>
                        </div>

                         {/* Legal Links */}
                         <div>
                            <h4 className="font-serif text-saffron-300 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-saffron-600/80">
                                <li><button onClick={() => setLegalInfo(LEGAL_CONTENT.privacy)} className="hover:text-saffron-400 transition-colors text-left">Privacy Policy</button></li>
                                <li><button onClick={() => setLegalInfo(LEGAL_CONTENT.terms)} className="hover:text-saffron-400 transition-colors text-left">Terms of Service</button></li>
                                <li><button onClick={() => setLegalInfo(LEGAL_CONTENT.refund)} className="hover:text-saffron-400 transition-colors text-left">Refund Policy</button></li>
                                <li><button onClick={() => setLegalInfo(LEGAL_CONTENT.disclaimer)} className="hover:text-saffron-400 transition-colors text-left">Disclaimer</button></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-saffron-900/20 pt-6 text-center text-xs text-saffron-900/40">
                        &copy; {new Date().getFullYear()} Divya Drishti. All Rights Reserved.
                    </div>
                </div>

                {/* Modals */}
                {legalInfo && (
                    <LegalModal 
                        title={legalInfo.title} 
                        content={legalInfo.content} 
                        onClose={() => setLegalInfo(null)} 
                    />
                )}

                {supportModal && (
                    <SupportModal 
                        type={supportModal} 
                        onClose={() => setSupportModal(null)} 
                    />
                )}
            </footer>
        </>
    );
};

const App: React.FC = () => {
  // Initialize User from LocalStorage to prevent logout on refresh
  const [user, setUser] = useState<UserProfile | null>(() => {
      const savedUser = localStorage.getItem('divya_drishti_user');
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const [view, setView] = useState<AppView>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  
  // Persist User State
  useEffect(() => {
      if (user) {
          localStorage.setItem('divya_drishti_user', JSON.stringify(user));
      } else {
          localStorage.removeItem('divya_drishti_user');
      }
  }, [user]);

  // Kundali State
  const [birthDetails, setBirthDetails] = useState<BirthDetailsForm | null>(null);
  const [chartData, setChartData] = useState<ChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Security: Disable Right Click and Copying (but allow printing)
  useEffect(() => {
    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleKeyEvents = (e: KeyboardEvent) => {
        // Block Print Screen only (allow Ctrl+P for professional printing)
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            alert("Screenshots are disabled for privacy reasons. Use the Download PDF button for high-quality prints.");
        }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyEvents);

    return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyEvents);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    setBirthDetails(null);
    setChartData(null);
    setView('dashboard');
    localStorage.removeItem('divya_drishti_user');
  };

  const openSubscriptionModal = () => {
      setPaymentConfig({
          type: 'subscription',
          onSuccess: () => {
              if (user) setUser({ ...user, isPremium: true });
              setPaymentConfig(null);
          }
      });
  };

  const handleChartDownloadRequest = () => {
      // If premium, direct download
      if (user?.isPremium) {
          downloadPDF('chart-report', 'Kundali_Chart.pdf');
          return;
      }

      // Else, charge ₹3 (Updated)
      setPaymentConfig({
          type: 'one-time',
          amount: 3,
          title: "Unlock Chart Download",
          description: "High-Quality PDF Report",
          onSuccess: () => {
              downloadPDF('chart-report', 'Kundali_Chart.pdf');
              setPaymentConfig(null);
          }
      });
  };

  const handleChartGeneration = async (details: BirthDetailsForm) => {
    // Check Limit: First 3 charts free
    if (user && !user.isPremium && (user.chartCount || 0) >= 3) {
        setPaymentConfig({
            type: 'subscription',
            title: "Free Limit Reached",
            description: "You have used your 3 free charts. Upgrade to Premium to continue unlocking cosmic wisdom.",
            onSuccess: () => {
                setUser(prev => prev ? ({ ...prev, isPremium: true }) : null);
                setPaymentConfig(null);
            }
        });
        return;
    }

    setIsLoading(true);
    setBirthDetails(details);
    try {
        const data = await fetchChartData(details);
        setChartData(data);
        if (user) {
            // Increment usage count
            const newCount = (user.chartCount || 0) + 1;
            setUser({ ...user, chartCount: newCount });
            await saveUserChart(user, details, data);
        }
        setView('kundali');
    } catch (e) {
        console.error("Error generating chart", e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditChart = () => {
    setChartData(null);
  };

  const handleNewChart = () => {
    setChartData(null);
    setBirthDetails(null);
  };

  const loadFromHistory = (details: BirthDetailsForm, chart: ChartResponse) => {
      setBirthDetails(details);
      setChartData(chart);
      setView('kundali');
  };

  const renderContent = () => {
    switch(view) {
      case 'kundali':
        return (
          <div className="container mx-auto px-4 py-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                <div className="lg:col-span-12 mb-2 flex items-center justify-between">
                   <button onClick={() => setView('dashboard')} className="flex items-center text-saffron-400 hover:text-saffron-200">
                      <ArrowLeft size={16} className="mr-1"/> Back to Dashboard
                   </button>

                   {/* Top Action Bar for Generated Chart */}
                   {chartData && (
                     <div className="flex gap-2">
                        <button 
                          onClick={handleEditChart}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-900/20 border border-saffron-500/30 text-saffron-300 hover:bg-saffron-900/40 text-sm transition-colors"
                          title="Edit birth details"
                        >
                           <Edit2 size={14} /> Edit Details
                        </button>
                        <button 
                          onClick={handleNewChart}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-900/20 border border-saffron-500/30 text-saffron-300 hover:bg-saffron-900/40 text-sm transition-colors"
                          title="Calculate a new chart"
                        >
                           <RotateCcw size={14} /> New Chart
                        </button>
                     </div>
                   )}
                </div>
                
                <div className="lg:col-span-5 space-y-6">
                  {!chartData ? (
                      <div className="flex justify-center">
                          <InputForm 
                            onSubmit={handleChartGeneration} 
                            isLoading={isLoading} 
                            lang={lang} 
                            initialValues={birthDetails}
                          />
                      </div>
                  ) : (
                      <div className="space-y-6 animate-fade-in-up">
                          <ChartDisplay data={chartData} onDownload={handleChartDownloadRequest} />
                      </div>
                  )}
                </div>
                <div className="lg:col-span-7">
                  {chartData && birthDetails ? (
                      <ChatInterface chartData={chartData} birthDetails={birthDetails} lang={lang} />
                  ) : (
                      <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-saffron-800/40 border-2 border-dashed border-saffron-900/30 rounded-2xl p-8 text-center bg-black/40 backdrop-blur-sm">
                          <Logo size="md" className="opacity-20 mb-4 grayscale" />
                          <h3 className="text-2xl font-serif text-saffron-900">{t('kundali_gen', lang)}</h3>
                          <p className="text-sm mt-2 max-w-xs mx-auto text-saffron-900/60">Generate your chart to unlock the AI Oracle.</p>
                      </div>
                  )}
                </div>
            </div>
          </div>
        );

      case 'rashifal':
        return <div className="container mx-auto px-4 py-8 pb-20"><Rashifal lang={lang} onBack={() => setView('dashboard')} /></div>;
      
      case 'matching':
        return <div className="container mx-auto px-4 py-8 pb-20"><KundaliMatching lang={lang} onBack={() => setView('dashboard')} /></div>;
      
      case 'panchang':
        return <div className="container mx-auto px-4 py-8 pb-20"><Panchang lang={lang} onBack={() => setView('dashboard')} /></div>;

      case 'numerology':
        return <div className="container mx-auto px-4 py-8 pb-20"><Numerology lang={lang} onBack={() => setView('dashboard')} /></div>;

      case 'gemstones':
        return <div className="container mx-auto px-4 py-8 pb-20"><Gemstones lang={lang} onBack={() => setView('dashboard')} /></div>;

      case 'profile':
        if (!user) return null;
        return <div className="container mx-auto px-4 py-8 pb-20"><Profile user={user} onSelectHistory={loadFromHistory} lang={lang} /></div>;

      case 'dashboard':
      default:
        return (
          <div className="flex flex-col min-h-full">
           <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-grow">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 animate-fade-in-up">
                <FeatureCard 
                  icon={<ScrollText size={32} />} 
                  title={t('kundali_gen', lang)} 
                  desc={t('kundali_desc', lang)}
                  onClick={() => setView('kundali')}
                />
                <FeatureCard 
                  icon={<Sparkles size={32} />} 
                  title={t('rashifal', lang)} 
                  desc={t('rashifal_desc', lang)}
                  onClick={() => setView('rashifal')}
                />
                <FeatureCard 
                  icon={<Heart size={32} />} 
                  title={t('matching', lang)} 
                  desc={t('matching_desc', lang)}
                  onClick={() => setView('matching')}
                />
                <FeatureCard 
                  icon={<CalendarIcon size={32} />} 
                  title={t('panchang', lang)} 
                  desc={t('panchang_desc', lang)}
                  onClick={() => setView('panchang')}
                />
                <FeatureCard 
                  icon={<Calculator size={32} />} 
                  title={t('numerology', lang)} 
                  desc={t('numerology_desc', lang)}
                  onClick={() => {
                     if (user?.isPremium) {
                         setView('numerology');
                     } else {
                         openSubscriptionModal();
                     }
                  }}
                  isLocked={!user?.isPremium}
                />
                <FeatureCard 
                  icon={<Diamond size={32} />} 
                  title={t('gemstones', lang)} 
                  desc={t('gemstones_desc', lang)}
                  onClick={() => {
                     if (user?.isPremium) {
                         setView('gemstones');
                     } else {
                         openSubscriptionModal();
                     }
                  }}
                  isLocked={!user?.isPremium}
                />
             </div>
           </div>
           
           {/* Footer Section appears here on scroll */}
           <Footer lang={lang} onNavigate={setView} />
          </div>
        );
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen relative text-saffron-100 font-sans selection:bg-saffron-900/50 selection:text-saffron-200 bg-black">
        {/* Animated Planetary Background - Fixed behind everything */}
        <CosmicBackground />

        {/* Content Layer */}
        <div className="relative z-10 h-screen w-full flex flex-col">
            {/* Navbar */}
            {user && (
              <nav className="border-b border-saffron-900/30 bg-maroon-900/90 backdrop-blur-md px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
                    {/* Updated to be visible on all screens (removed hidden sm:block) */}
                    <Logo size="sm" className="block" />
                    <span className="font-serif text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-red-400 py-1 leading-normal">
                      {t('app_name', lang)}
                    </span>
                    {user.isPremium && <span className="text-[10px] bg-gradient-to-r from-saffron-400 to-yellow-200 text-black px-2 py-0.5 rounded-full font-bold ml-1 flex items-center gap-1"><Crown size={10}/> PRO</span>}
                  </div>
                  
                  <div className="flex items-center gap-3 md:gap-4">
                      <LanguageSwitch lang={lang} setLang={setLang} />
                      
                      {!user.isPremium && (
                          <button 
                            onClick={openSubscriptionModal}
                            className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-saffron-600 to-red-600 hover:from-saffron-500 hover:to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-saffron-900/20 transition-all transform hover:scale-105"
                          >
                             <Crown size={14} /> Go Premium
                          </button>
                      )}

                      <button 
                        onClick={() => setView('dashboard')}
                        className={`p-2 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-saffron-900/40 text-saffron-200' : 'text-saffron-600 hover:text-saffron-300'}`}
                        title="Dashboard"
                      >
                        <LayoutDashboard size={20} />
                      </button>
                      <button 
                        onClick={() => setView('profile')}
                        className={`p-2 rounded-lg transition-colors ${view === 'profile' ? 'bg-saffron-900/40 text-saffron-200' : 'text-saffron-600 hover:text-saffron-300'}`}
                        title="Profile"
                      >
                        <User size={20} />
                      </button>
                      <div className="h-6 w-[1px] bg-saffron-900/50"></div>
                      <button 
                        onClick={handleLogout}
                        className="text-xs flex items-center gap-2 border border-saffron-800 text-saffron-500 px-3 py-1.5 rounded hover:bg-red-900/20 hover:border-red-800 hover:text-red-400 transition-all"
                      >
                        <LogOut size={14} />
                        <span className="hidden sm:inline">Logout</span>
                      </button>
                  </div>
              </nav>
            )}

            {!user ? (
               <div className="flex-grow flex flex-col items-center justify-center h-full w-full overflow-hidden p-4 relative">
                  
                  {/* Language Switcher on Landing Page */}
                  <div className="absolute top-4 right-4 z-50">
                     <LanguageSwitch lang={lang} setLang={setLang} />
                  </div>

                  <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-20">
                    <div className="text-center md:text-left flex flex-col items-center md:items-start space-y-4">
                      <Logo size="lg" className="scale-75 md:scale-100 transform transition-transform" />
                      
                      {/* App Name and Tagline for all screens */}
                      <div className="mt-2">
                        <p className="text-saffron-100/70 text-lg font-light leading-relaxed tracking-wide mt-2">
                          <span className="text-saffron-400 font-serif">Cosmic Consciousness</span> Awaits.
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full max-w-md">
                        <Auth onLogin={setUser} lang={lang} />
                    </div>
                  </div>
               </div>
            ) : (
                <main className="flex-grow overflow-y-auto custom-scrollbar relative z-10">
                   {renderContent()}
                </main>
            )}
        </div>
        
        {/* Global Assistant Chatbot - Only when logged in */}
        {user && <GlobalAssistant lang={lang} onNavigate={setView} onOpenPremium={openSubscriptionModal} />}

        {/* Premium/Payment Modal */}
        {paymentConfig && (
            <PremiumModal 
                onClose={() => setPaymentConfig(null)}
                onSuccess={paymentConfig.onSuccess}
                lang={lang}
                config={{
                    type: paymentConfig.type,
                    amount: paymentConfig.amount,
                    title: paymentConfig.title,
                    description: paymentConfig.description
                }}
            />
        )}

      </div>
    </HashRouter>
  );
};

const FeatureCard = ({ icon, title, desc, onClick, disabled, isLocked }: any) => (
  <div 
    onClick={!disabled ? onClick : undefined}
    className={`group relative overflow-hidden bg-gradient-to-br from-black/60 to-maroon-900/40 border border-saffron-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-saffron-500/50 transition-all duration-300 backdrop-blur-sm ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl hover:shadow-saffron-900/20 hover:-translate-y-1'}`}
  >
    <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity text-saffron-500 transform group-hover:scale-110 duration-500">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 48, className: "opacity-20" }) : icon}
    </div>
    <div className="relative z-10 flex flex-col h-full">
      <div className="mb-3 sm:mb-4 text-saffron-400 group-hover:text-saffron-200 transition-colors bg-saffron-900/20 w-fit p-2 sm:p-3 rounded-lg sm:rounded-xl border border-saffron-900/30">
        {React.isValidElement(icon) ? (
            <>
                <span className="block sm:hidden">{React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}</span>
                <span className="hidden sm:block">{React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}</span>
            </>
        ) : icon}
      </div>
      
      <div className="flex justify-between items-start">
          <h3 className="text-sm sm:text-xl font-serif font-bold text-saffron-100 mb-1 sm:mb-2">{title}</h3>
          {isLocked && <Lock size={14} className="text-saffron-500 shrink-0" />}
      </div>
      
      <p className="text-[10px] sm:text-sm text-saffron-600/80 group-hover:text-saffron-500 transition-colors leading-relaxed line-clamp-2 sm:line-clamp-none">{desc}</p>
      
      {!disabled && (
        <div className="mt-auto pt-3 sm:pt-4 flex items-center text-[10px] sm:text-xs font-bold text-saffron-600 uppercase tracking-widest group-hover:text-saffron-300 transition-colors">
          {isLocked ? (
              <span className="text-saffron-500 flex items-center gap-1"><Crown size={12}/> Unlock</span>
          ) : (
              <span className="flex items-center gap-1">Open <span className="hidden sm:inline">Tool</span> <ArrowLeft className="rotate-180 ml-1 sm:ml-2" size={10} /></span>
          )}
        </div>
      )}
    </div>
    
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-saffron-500/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
  </div>
);

export default App;
