
import React, { useEffect, useState } from 'react';
import { UserProfile, BirthDetailsForm, ChartResponse, Language } from '../types';
import { getUserHistory, HistoryItem } from '../services/dbService';
import { Clock, MapPin, ChevronRight, User } from 'lucide-react';
import { t } from '../services/translations';

interface ProfileProps {
  user: UserProfile;
  onSelectHistory: (details: BirthDetailsForm, chart: ChartResponse) => void;
  lang: Language;
}

export const Profile: React.FC<ProfileProps> = ({ user, onSelectHistory, lang }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        const data = await getUserHistory(user);
        setHistory(data);
        setLoading(false);
      }
    };
    loadHistory();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* User Header */}
      <div className="bg-maroon-900/50 backdrop-blur-md border border-saffron-900/30 rounded-2xl p-8 flex items-center gap-6 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron-600 to-maroon-800 flex items-center justify-center border-2 border-saffron-400/50">
          <span className="text-3xl font-serif text-white">
            {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-serif text-saffron-200">
            {user.displayName === "Seeker" ? t('mystic_seeker', lang) : (user.displayName || t('mystic_seeker', lang))}
          </h2>
          <p className="text-saffron-600/80">{user.email}</p>
        </div>
      </div>

      {/* Activity History */}
      <div>
        <h3 className="text-xl font-serif text-saffron-400 mb-4 px-2 flex items-center gap-2">
          <Clock size={20} />
          {t('previous_consultations', lang)}
        </h3>
        
        {loading ? (
          <div className="text-center py-12 text-saffron-600">{t('loading_history', lang)}</div>
        ) : history.length === 0 ? (
          <div className="bg-black/30 border border-saffron-900/20 rounded-xl p-8 text-center text-saffron-600">
            {t('no_history', lang)}
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectHistory(item.birthDetails, item.chartData)}
                className="group bg-black/40 border border-saffron-900/30 hover:border-saffron-500/50 rounded-xl p-5 cursor-pointer transition-all hover:bg-maroon-900/30 flex justify-between items-center"
              >
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-saffron-900/20 rounded-lg text-saffron-500 group-hover:text-saffron-300 transition-colors">
                      <User size={24} />
                   </div>
                   <div>
                      <h4 className="text-lg font-medium text-saffron-200 group-hover:text-white transition-colors">
                        {item.birthDetails.name}
                      </h4>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-saffron-600/80">
                         <span className="flex items-center gap-1"><Clock size={12}/> {item.birthDetails.date} at {item.birthDetails.time}</span>
                         <span className="flex items-center gap-1"><MapPin size={12}/> {item.birthDetails.location}</span>
                      </div>
                   </div>
                </div>
                <ChevronRight className="text-saffron-800 group-hover:text-saffron-400 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};