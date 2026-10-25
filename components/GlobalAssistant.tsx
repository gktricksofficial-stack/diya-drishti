
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ArrowRight, Crown, AlertCircle } from 'lucide-react';
import { Language, AppView } from '../types';
import { getAppGuideResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  lang: Language;
  onNavigate: (view: AppView) => void;
  onOpenPremium: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isError?: boolean;
  action?: {
    type: 'navigate' | 'premium';
    target: string;
  };
}

export const GlobalAssistant: React.FC<Props> = ({ lang, onNavigate, onOpenPremium }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const getGreeting = (l: Language) => {
      return l === 'hi' 
        ? "नमस्ते! मैं **ऐप गाइड** हूँ। मैं आपको टूल्स खोजने या प्रीमियम प्लान लेने में मदद कर सकता हूँ।" 
        : "Namaste! I am your **App Guide**. I can help you find tools or upgrade to Premium.";
  };

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: getGreeting(lang), sender: 'bot' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-open on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Update greeting if language changes and it's the only message
  useEffect(() => {
      if (messages.length === 1 && messages[0].sender === 'bot') {
          setMessages([{
              id: '1',
              text: getGreeting(lang),
              sender: 'bot'
          }]);
      }
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await getAppGuideResponse(userMsg.text, lang);
      
      // Parse Action Codes
      const premiumMatch = responseText.match(/\[PREMIUM:([A-Z_ ]+)\]/i);
      const navigateMatch = responseText.match(/\[NAVIGATE:([A-Z_ ]+)\]/i);
      
      let cleanText = responseText.replace(/\[(PREMIUM|NAVIGATE):[A-Z_ ]+\]/gi, '').trim();
      let action = undefined;

      if (premiumMatch) {
         action = { type: 'premium' as const, target: premiumMatch[1].toLowerCase().trim() };
      } else if (navigateMatch) {
         action = { type: 'navigate' as const, target: navigateMatch[1].toLowerCase().trim() };
      }

      const botMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          text: cleanText, 
          sender: 'bot',
          action 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "Sorry, I'm having trouble connecting to the cosmos right now. Please check your internet or try again later.",
          sender: 'bot',
          isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action: { type: 'navigate' | 'premium', target: string }) => {
      if (action.type === 'navigate') {
          let target = action.target;
          
          // Normalize common navigation intent keywords to valid routes
          // Fixes blank page issue for generic "open app" or "dashboard"
          if (['app', 'home', 'main', 'start', 'menu', 'open app', 'dashboard', 'features'].some(k => target.includes(k))) {
              target = 'dashboard';
          }
          
          // Map 'numbers' to 'numerology', 'gem' to 'gemstones' etc for robustness
          if (target.includes('number')) target = 'numerology';
          if (target.includes('gem')) target = 'gemstones';
          if (target.includes('kundali') || target.includes('birth')) target = 'kundali';
          if (target.includes('match')) target = 'matching';
          
          onNavigate(target as AppView);
          setIsOpen(false); // Close chat on navigation to show the tool
      } else if (action.type === 'premium') {
          onOpenPremium(); 
      }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-maroon-900/95 backdrop-blur-xl border border-saffron-500/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col h-[450px]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-saffron-700 to-maroon-800 p-4 flex justify-between items-center border-b border-saffron-500/30">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-200 animate-pulse" />
              <h3 className="font-serif text-white font-bold">App Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/40 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-saffron-600 text-white rounded-tr-none' 
                    : msg.isError 
                        ? 'bg-red-900/60 border border-red-500/50 text-red-100 rounded-tl-none'
                        : 'bg-black/60 border border-saffron-900/40 text-saffron-100 rounded-tl-none'
                }`}>
                  {msg.isError ? (
                      <div className="flex items-center gap-2">
                          <AlertCircle size={16} />
                          <span>{msg.text}</span>
                      </div>
                  ) : (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                  )}
                </div>
                
                {/* Action Button */}
                {msg.action && (
                    <button 
                        onClick={() => handleAction(msg.action!)}
                        className={`mt-2 text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-full transition-all shadow-lg ${
                            msg.action.type === 'premium' 
                            ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white hover:scale-105' 
                            : 'bg-saffron-900/50 text-saffron-200 border border-saffron-500/30 hover:bg-saffron-900/80'
                        }`}
                    >
                        {msg.action.type === 'premium' ? <Crown size={12} /> : <ArrowRight size={12} />}
                        {/* Clean up button text display */}
                        {msg.action.type === 'premium' 
                            ? 'Go Premium & Unlock' 
                            : `Open ${['app','dashboard','home'].some(k => msg.action!.target.includes(k)) ? 'Dashboard' : msg.action!.target.toUpperCase()}`}
                    </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-black/60 border border-saffron-900/40 rounded-xl rounded-tl-none p-3 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-saffron-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-saffron-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-saffron-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-black/60 border-t border-saffron-900/30">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={lang === 'hi' ? "यहाँ पूछें..." : "Ask here..."}
                className="w-full bg-maroon-900/50 border border-saffron-900/50 rounded-full py-2 pl-4 pr-10 text-sm text-saffron-100 focus:outline-none focus:border-saffron-500 transition-all placeholder-saffron-700"
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim() || loading}
                className="absolute right-1 top-1 p-1.5 bg-saffron-600 rounded-full text-maroon-900 hover:bg-saffron-500 disabled:opacity-50 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-maroon-800 text-saffron-400 rotate-90 border border-saffron-900' 
            : 'bg-gradient-to-r from-saffron-600 to-orange-600 text-white animate-bounce-slow'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};
