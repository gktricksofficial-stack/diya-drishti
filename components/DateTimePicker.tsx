
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { Language } from '../types';
import { t } from '../services/translations';

interface DateTimePickerProps {
  mode: 'date' | 'time';
  initialValue?: string; // "YYYY-MM-DD" or "HH:MM"
  onClose: () => void;
  onSelect: (value: string) => void;
  lang?: Language;
}

const ITEM_HEIGHT = 40;

// Utility to generate number arrays
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ScrollColumn: React.FC<{
  items: (string | number)[];
  selectedValue: string | number;
  onChange: (val: string | number) => void;
  label?: string;
}> = ({ items, selectedValue, onChange, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize scroll position once
  useEffect(() => {
    if (containerRef.current) {
      const index = items.findIndex(i => i === selectedValue);
      if (index !== -1) {
        containerRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
  }, []); // Run only on mount to set initial position

  // If items change (e.g. days in month), ensure we are not out of bounds or wildly off
  useEffect(() => {
      // Logic to auto-correct scroll if the selected value changed externally (like from parent initialization)
      // but we avoid doing this on every render to prevent fighting user scroll.
      if (containerRef.current && !isScrolling.current) {
           const index = items.findIndex(i => i === selectedValue);
           if (index !== -1) {
              // Only adjust if significantly off to avoid jitter
              const currentScroll = containerRef.current.scrollTop;
              const targetScroll = index * ITEM_HEIGHT;
              if (Math.abs(currentScroll - targetScroll) > ITEM_HEIGHT * 2) {
                   containerRef.current.scrollTop = targetScroll;
              }
           }
      }
  }, [items.length, selectedValue]); 

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isScrolling.current = true;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    // Using a timeout to detect "Scroll End" since onScroll fires rapidly
    searchTimeoutRef.current = setTimeout(() => {
        isScrolling.current = false;
        // Fix: Use containerRef instead of e.currentTarget because the event object 
        // or currentTarget might be null/invalidated inside the async timeout.
        if (containerRef.current) {
            const scrollTop = containerRef.current.scrollTop;
            const index = Math.round(scrollTop / ITEM_HEIGHT);
            if (items[index] !== undefined && items[index] !== selectedValue) {
                 onChange(items[index]);
            }
        }
    }, 150); // 150ms settle time
  };
  
  // Handle explicit interaction end (click, touch up)
  const handleInteractionEnd = (e: any) => {
     // Force snap calculation
     const scrollTop = e.currentTarget.scrollTop;
     const index = Math.round(scrollTop / ITEM_HEIGHT);
     if (items[index] !== undefined) {
         onChange(items[index]);
         // Optional: Smooth snap to exact center
         e.currentTarget.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
     }
  };

  return (
    <div className="flex flex-col items-center relative group">
      {label && <span className="absolute -top-6 text-[10px] uppercase tracking-widest text-saffron-600/70">{label}</span>}
      <div 
        ref={containerRef}
        className="w-full h-[200px] overflow-y-auto snap-y snap-mandatory no-scrollbar relative z-10"
        onScroll={handleScroll}
        onMouseUp={handleInteractionEnd}
        onTouchEnd={handleInteractionEnd}
      >
        <div style={{ height: ITEM_HEIGHT * 2 }} /> {/* Top Spacer */}
        {items.map((item, i) => (
          <div 
            key={item} 
            className={`h-[40px] flex items-center justify-center snap-center transition-all duration-200 cursor-pointer ${
              item === selectedValue 
                ? 'text-saffron-100 font-bold text-lg scale-110 opacity-100' 
                : 'text-saffron-900/40 text-sm scale-90 opacity-50'
            }`}
            onClick={() => {
                if (containerRef.current) {
                    containerRef.current.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                    onChange(item);
                }
            }}
          >
            {item}
          </div>
        ))}
        <div style={{ height: ITEM_HEIGHT * 2 }} /> {/* Bottom Spacer */}
      </div>
    </div>
  );
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ mode, initialValue, onClose, onSelect, lang = 'en' }) => {
  // State for Date
  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<string>(months[0]);
  const [year, setYear] = useState<number>(1990);

  // State for Time
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [ampm, setAmpm] = useState<string>("AM");

  // Parse Initial Value safely without Timezone shifts
  useEffect(() => {
    if (mode === 'date' && initialValue) {
      // Manual parsing "YYYY-MM-DD"
      const parts = initialValue.split('-');
      if (parts.length === 3) {
          setYear(parseInt(parts[0]));
          // Month is 1-based in string, 0-based in logic usually but here we use string match
          const mIndex = parseInt(parts[1]) - 1;
          if (months[mIndex]) setMonth(months[mIndex]);
          setDay(parseInt(parts[2]));
      }
    } else if (mode === 'time' && initialValue) {
      const [hStr, mStr] = initialValue.split(':');
      let h = parseInt(hStr);
      const m = parseInt(mStr);
      const isPm = h >= 12;
      
      if (h > 12) h -= 12;
      if (h === 0) h = 12; // 00:00 is 12 AM
      
      setHour(h);
      setMinute(m);
      setAmpm(isPm ? "PM" : "AM");
    }
  }, [initialValue, mode]);

  const handleConfirm = () => {
    if (mode === 'date') {
      const monthIndex = months.indexOf(month);
      // Format: YYYY-MM-DD
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onSelect(dateStr);
    } else {
      let h = hour;
      if (ampm === "PM" && h !== 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      // Format: HH:MM
      const timeStr = `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      onSelect(timeStr);
    }
  };

  // Get Days in selected month/year
  const daysInMonth = useMemo(() => {
     const monthIndex = months.indexOf(month);
     // Use year, monthIndex+1, 0 to get last day of month
     return new Date(year, monthIndex + 1, 0).getDate();
  }, [month, year]);

  // Ensure day is valid when month changes (e.g. Feb 31 -> Feb 28)
  useEffect(() => {
      if (day > daysInMonth) setDay(daysInMonth);
  }, [daysInMonth, day]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-maroon-900 border-t sm:border border-saffron-900/50 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-saffron-900/30 bg-black/20">
            <button onClick={onClose} className="p-2 text-saffron-800 hover:text-red-400 transition-colors">
                <X size={20} />
            </button>
            <h3 className="text-saffron-100 font-serif tracking-wide text-lg">
                {mode === 'date' ? t('select_birth_date', lang as Language) : t('select_birth_time', lang as Language)}
            </h3>
            <button onClick={handleConfirm} className="p-2 text-green-400 hover:text-green-300 transition-colors">
                <Check size={24} />
            </button>
        </div>

        {/* Picker Body */}
        <div className="relative py-8 px-4 bg-gradient-to-b from-maroon-900 via-maroon-800 to-maroon-900">
            
            {/* Selection Highlight Bar (The "Lens") */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[40px] bg-saffron-500/10 border-y border-saffron-500/30 pointer-events-none z-0"></div>
            
            {/* Gradients for 3D Mask Effect */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-maroon-900 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-maroon-900 to-transparent z-20 pointer-events-none"></div>

            <div className="flex justify-center gap-2 sm:gap-4 relative z-10">
                {mode === 'date' ? (
                    <>
                        <div className="w-20"><ScrollColumn label="Day" items={range(1, daysInMonth)} selectedValue={day} onChange={(v) => setDay(Number(v))} /></div>
                        <div className="w-32"><ScrollColumn label="Month" items={months} selectedValue={month} onChange={(v) => setMonth(String(v))} /></div>
                        <div className="w-24"><ScrollColumn label="Year" items={range(1900, new Date().getFullYear())} selectedValue={year} onChange={(v) => setYear(Number(v))} /></div>
                    </>
                ) : (
                    <>
                        <div className="w-20"><ScrollColumn label="Hour" items={range(1, 12)} selectedValue={hour} onChange={(v) => setHour(Number(v))} /></div>
                        <div className="flex items-center text-saffron-500 mb-2 font-bold text-xl">:</div>
                        <div className="w-20"><ScrollColumn label="Minute" items={range(0, 59).map(m => m < 10 ? `0${m}` : m)} selectedValue={minute < 10 ? `0${minute}` : minute} onChange={(v) => setMinute(Number(v))} /></div>
                        <div className="w-20"><ScrollColumn label="AM/PM" items={["AM", "PM"]} selectedValue={ampm} onChange={(v) => setAmpm(String(v))} /></div>
                    </>
                )}
            </div>
        </div>

        {/* Footer/Action */}
        <div className="p-4 bg-black/20 border-t border-saffron-900/30">
            <button 
                onClick={handleConfirm}
                className="w-full py-3 bg-saffron-700 hover:bg-saffron-600 text-maroon-900 font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
                {t('confirm_selection', lang as Language)}
            </button>
        </div>

      </div>
    </div>
  );
};