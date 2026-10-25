
import React, { useState, useEffect, useRef } from 'react';
import { BirthDetailsForm, Language } from '../types';
import { MapPin, Calendar, Clock, User, ChevronDown, Search, X } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';
import { searchCities, getAddressFromCoordinates, LocationResult } from '../services/locationService';
import { t } from '../services/translations';

interface InputFormProps {
  onSubmit: (data: BirthDetailsForm) => void;
  isLoading: boolean;
  lang: Language;
  initialValues?: BirthDetailsForm | null;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, lang, initialValues }) => {
  const [formData, setFormData] = useState<BirthDetailsForm>({
    name: '',
    date: '',
    time: '',
    location: '',
    latitude: 28.6139, // Default New Delhi
    longitude: 77.2090
  });

  // Load initial values if provided (Edit Mode)
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  // Picker visibility states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Location Search State
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'location') {
      // Debounce location search
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (value.length > 2) {
        setIsSearchingLoc(true);
        searchTimeoutRef.current = setTimeout(async () => {
          const results = await searchCities(value);
          setSuggestions(results);
          setIsSearchingLoc(false);
          setShowSuggestions(true);
        }, 500);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const selectLocation = (loc: LocationResult) => {
    setFormData(prev => ({
      ...prev,
      location: loc.name,
      latitude: loc.lat,
      longitude: loc.lon
    }));
    setShowSuggestions(false);
  };

  const handleLiveLocation = () => {
    if (navigator.geolocation) {
      setIsSearchingLoc(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoordinates(latitude, longitude);
          
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            location: address
          }));
          setIsSearchingLoc(false);
        },
        (error) => {
          console.error("Geo error", error);
          alert("Could not detect location. Please enter manually.");
          setIsSearchingLoc(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Helper to display friendly date/time
  const getDisplayDate = () => {
    if (!formData.date) return "";
    const [y, m, d] = formData.date.split('-');
    const date = new Date(Number(y), Number(m)-1, Number(d));
    // Use simple localized string or custom format. 
    // For multi-language consistent display:
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDisplayTime = () => {
      if (!formData.time) return "";
      const [h, m] = formData.time.split(':');
      const date = new Date();
      date.setHours(Number(h));
      date.setMinutes(Number(m));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-md bg-maroon-900/50 backdrop-blur-sm border border-saffron-900/30 p-8 rounded-2xl shadow-2xl relative">
      <h2 className="text-2xl font-serif text-saffron-400 mb-6 text-center border-b border-saffron-900/50 pb-4">
        {t('enter_birth_details', lang)}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <div className="relative group">
          <div className="absolute left-3 top-3 text-saffron-600">
            <User size={18} />
          </div>
          <input
            type="text"
            name="name"
            placeholder={t('full_name', lang)}
            required
            className="w-full bg-black/40 border border-saffron-900/50 rounded-lg py-3 pl-10 text-saffron-100 placeholder-saffron-800/50 focus:outline-none focus:border-saffron-500 transition-colors"
            onChange={handleChange}
            value={formData.name}
            autoComplete="off"
          />
        </div>

        {/* Date & Time Custom Pickers */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Date Picker Trigger */}
          <div className="relative cursor-pointer group" onClick={() => setShowDatePicker(true)}>
             <div className="absolute left-3 top-3 text-saffron-600">
              <Calendar size={18} />
            </div>
            <div className={`w-full bg-black/40 border border-saffron-900/50 rounded-lg py-3 pl-10 pr-8 text-sm truncate focus:border-saffron-500 transition-colors ${formData.date ? 'text-saffron-100' : 'text-saffron-800/50'}`}>
                {formData.date ? getDisplayDate() : t('select_date', lang)}
            </div>
            <div className="absolute right-2 top-3 text-saffron-900 group-hover:text-saffron-500 transition-colors">
                <ChevronDown size={16} />
            </div>
          </div>

          {/* Time Picker Trigger */}
          <div className="relative cursor-pointer group" onClick={() => setShowTimePicker(true)}>
             <div className="absolute left-3 top-3 text-saffron-600">
              <Clock size={18} />
            </div>
             <div className={`w-full bg-black/40 border border-saffron-900/50 rounded-lg py-3 pl-10 pr-8 text-sm truncate focus:border-saffron-500 transition-colors ${formData.time ? 'text-saffron-100' : 'text-saffron-800/50'}`}>
                {formData.time ? getDisplayTime() : t('select_time', lang)}
            </div>
             <div className="absolute right-2 top-3 text-saffron-900 group-hover:text-saffron-500 transition-colors">
                <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Location with Autocomplete */}
        <div className="relative z-20">
           <div className="absolute left-3 top-3 text-saffron-600">
              <MapPin size={18} />
            </div>
          <input
            type="text"
            name="location"
            placeholder={t('place_of_birth', lang)}
            required
            value={formData.location}
            className="w-full bg-black/40 border border-saffron-900/50 rounded-lg py-3 pl-10 pr-10 text-saffron-100 placeholder-saffron-800/50 focus:outline-none focus:border-saffron-500"
            onChange={handleChange}
            onFocus={() => { if(formData.location.length > 2) setShowSuggestions(true); }}
            autoComplete="off"
          />
          <button 
            type="button" 
            onClick={handleLiveLocation}
            className="absolute right-2 top-2 p-1 text-saffron-600 hover:text-saffron-400 hover:bg-saffron-900/30 rounded-full transition-colors"
            title={t('use_current_location', lang)}
          >
            {isSearchingLoc ? <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <MapPin size={16} className="animate-pulse"/>}
          </button>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-maroon-900 border border-saffron-900/50 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 animate-fade-in custom-scrollbar">
                {suggestions.map((item, idx) => (
                    <div 
                        key={idx}
                        className="px-4 py-3 hover:bg-saffron-900/20 cursor-pointer text-sm text-saffron-200 border-b border-saffron-900/10 last:border-0"
                        onClick={() => selectLocation(item)}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
          )}
          
          {/* Close suggestions overlay when clicking outside logic handled roughly by clicking item */}
          {showSuggestions && (
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowSuggestions(false)}></div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.date || !formData.time}
          className="w-full mt-6 bg-gradient-to-r from-saffron-700 to-red-700 text-white font-serif font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(255,160,0,0.3)] hover:shadow-[0_0_25px_rgba(255,160,0,0.5)] transform transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('calculating', lang)}
            </span>
          ) : t('generate_horoscope', lang)}
        </button>
      </form>

      {/* Modern Pickers */}
      {showDatePicker && (
          <DateTimePicker 
            mode="date" 
            initialValue={formData.date}
            onClose={() => setShowDatePicker(false)}
            onSelect={(val) => {
                setFormData({...formData, date: val});
                setShowDatePicker(false);
            }}
            lang={lang}
          />
      )}

      {showTimePicker && (
          <DateTimePicker 
            mode="time" 
            initialValue={formData.time}
            onClose={() => setShowTimePicker(false)}
            onSelect={(val) => {
                setFormData({...formData, time: val});
                setShowTimePicker(false);
            }}
            lang={lang}
          />
      )}

    </div>
  );
};
