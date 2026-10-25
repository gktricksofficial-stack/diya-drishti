
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../services/translations';
import { ChevronDown, Globe } from 'lucide-react';

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
}

export const LanguageSwitch: React.FC<Props> = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find(l => l.code === lang);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-maroon-900/50 border border-saffron-900/50 hover:border-saffron-500 rounded-lg px-3 py-2 transition-all text-saffron-200"
      >
        <Globe size={16} className="text-saffron-500" />
        <span className="text-sm font-medium hidden sm:inline">{selectedLang?.native}</span>
        <span className="text-sm font-medium sm:hidden">{selectedLang?.code.toUpperCase()}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-maroon-900 border border-saffron-900/50 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-saffron-900/20 transition-colors flex justify-between items-center ${
                  lang === l.code ? 'bg-saffron-900/30 text-saffron-100' : 'text-saffron-300/80'
                }`}
              >
                <span className="font-medium">{l.native}</span>
                <span className="text-xs text-saffron-600 uppercase opacity-60">{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};