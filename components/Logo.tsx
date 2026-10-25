
import React from 'react';

export const Logo: React.FC<{ className?: string, size?: "sm" | "md" | "lg" }> = ({ className = "", size = "md" }) => {
  
  const dimensions = {
    sm: "w-10 h-10",
    md: "w-32 h-32",
    lg: "w-56 h-56"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-2xl",
    lg: "text-5xl"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${dimensions[size]} flex items-center justify-center`}>
        
        {/* Sacred Geometry / Mandala Background */}
        <div className="absolute inset-0 rounded-full border border-saffron-700/30 animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-2 rounded-full border border-saffron-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
        
        {/* Glow Effects */}
        <div className="absolute inset-0 rounded-full bg-saffron-500/5 blur-xl"></div>

        {/* The Eye (Drishti) */}
        <svg viewBox="0 0 100 100" className="w-full h-full p-2 drop-shadow-[0_0_15px_rgba(255,165,0,0.6)]">
            <defs>
                <linearGradient id="divyaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            {/* Third Eye Outer Shape */}
            <path d="M 10 50 Q 50 10 90 50 Q 50 90 10 50" fill="none" stroke="url(#divyaGrad)" strokeWidth="2.5" />
            
            {/* Inner Details */}
            <path d="M 25 50 Q 50 30 75 50 Q 50 70 25 50" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
            
            {/* Iris/Pupil - stylized as a Chakra */}
            <g className="origin-center animate-[spin_8s_linear_infinite]">
                 <circle cx="50" cy="50" r="12" stroke="url(#divyaGrad)" strokeWidth="1.5" fill="none" strokeDasharray="2,2"/>
            </g>
            <circle cx="50" cy="50" r="6" fill="url(#divyaGrad)" className="animate-pulse" filter="url(#glow)" />
            
            {/* Vertical Tilak/Flame */}
            <path d="M 50 35 Q 45 25 50 15 Q 55 25 50 35" fill="#ef4444" opacity="0.8" className="animate-pulse" />
        </svg>
      </div>
      
      {size !== 'sm' && (
        <div className="mt-4 text-center">
            {/* App Name - Updated to use saffron-400 which is definitely defined */}
            <h1 className={`${textSizes[size]} font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-yellow-300 to-saffron-400 tracking-[0.15em] drop-shadow-lg leading-normal block py-2`}>
              DIVYA DRISHTI
            </h1>
            
            {/* Tagline */}
            <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-[1px] w-8 bg-saffron-700"></div>
                <p className="text-saffron-200 text-xs tracking-[0.4em] uppercase opacity-70">Cosmic Insight</p>
                <div className="h-[1px] w-8 bg-saffron-700"></div>
            </div>
        </div>
      )}
    </div>
  );
};
