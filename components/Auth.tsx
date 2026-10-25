
import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { UserProfile, Language } from '../types';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { t } from '../services/translations';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
  lang: Language;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password Validation State
  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const resetForm = () => {
    setError('');
    setPassword('');
    setEmail('');
    setName('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Strict Password Validation for Sign Up
    if (!isLogin) {
      if (!name.trim()) {
        setError("Name is required.");
        setLoading(false);
        return;
      }
      if (!Object.values(validations).every(Boolean)) {
        setError("Weak password.");
        setLoading(false);
        return;
      }
    }

    // SIMULATED AUTHENTICATION (Demo Mode)
    setTimeout(() => {
        setLoading(false);
        
        // Reverted to random ID generation for Demo Mode
        onLogin({ 
          uid: `user_${Date.now()}`, 
          email: email || "seeker@example.com", 
          displayName: isLogin ? (name || "Seeker") : name,
          chartCount: 0 // Initialize chart usage count
        });
    }, 1000);
  };

  return (
    <div className="w-full max-w-md p-6 bg-maroon-900/60 border border-saffron-900/40 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
       {/* Decorative glow */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-saffron-500 to-transparent"></div>
       
       <h2 className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-saffron-200 to-saffron-500 mb-1 text-center tracking-wide">
         {isLogin ? t('login_title', lang) : t('signup_title', lang)}
       </h2>
       
       {error && (
         <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 p-2 rounded-lg mb-3 text-red-200 text-xs animate-pulse">
           <AlertCircle size={14} />
           {error}
         </div>
       )}

       <form onSubmit={handleAuth} className="space-y-3">
         
         {/* Name Field - Sign Up Only */}
         {!isLogin && (
           <div className="space-y-1 animate-fade-in">
             <input 
                type="text" 
                placeholder={t('full_name', lang)}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-black/50 border border-saffron-900/50 rounded-lg px-4 py-2.5 text-sm text-saffron-100 placeholder-saffron-800/50 focus:outline-none focus:border-saffron-500 transition-colors"
             />
           </div>
         )}

         {/* Email Field */}
         <div className="space-y-1">
            <input 
                type="email" 
                placeholder={t('email_addr', lang)}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-saffron-900/50 rounded-lg px-4 py-2.5 text-sm text-saffron-100 placeholder-saffron-800/50 focus:outline-none focus:border-saffron-500 transition-colors"
                required
            />
         </div>

         {/* Password Field */}
         <div className="space-y-1">
            <div className="relative">
              <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t('password', lang)}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-saffron-900/50 rounded-lg px-4 py-2.5 text-sm text-saffron-100 placeholder-saffron-800/50 focus:outline-none focus:border-saffron-500 transition-colors pr-10"
                  required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-saffron-700 hover:text-saffron-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
         </div>

         {/* Password Requirements - Compact View */}
         {!isLogin && (
           <div className="bg-black/30 p-2 rounded-lg grid grid-cols-2 gap-1 text-[10px] animate-fade-in">
             <Requirement label="8+ chars" met={validations.length} />
             <Requirement label="Uppercase" met={validations.upper} />
             <Requirement label="Number" met={validations.number} />
             <Requirement label="Symbol" met={validations.special} />
           </div>
         )}

         <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-saffron-700 to-red-800 hover:from-saffron-600 hover:to-red-700 text-saffron-50 font-bold py-2.5 rounded-lg shadow-lg shadow-saffron-900/20 transform transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
         >
            {loading ? t('consulting', lang) : (isLogin ? t('login_btn', lang) : t('signup_btn', lang))}
         </button>
       </form>

       <div className="mt-4 text-center">
         <button 
          onClick={toggleMode}
          className="text-saffron-400 hover:text-saffron-200 text-xs font-semibold border-b border-saffron-400/30 hover:border-saffron-200 transition-colors pb-0.5"
         >
           {isLogin ? t('create_account_link', lang) : t('existing_login_link', lang)}
         </button>
       </div>
    </div>
  );
};

const Requirement = ({ label, met }: { label: string, met: boolean }) => (
  <div className={`flex items-center gap-1 ${met ? 'text-green-400' : 'text-saffron-900/60'}`}>
    {met ? <Check size={10} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full border border-saffron-900/40"></div>}
    <span>{label}</span>
  </div>
);
