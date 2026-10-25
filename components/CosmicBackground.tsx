
import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Base Gradient Background (Matches original UI theme) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a0a0a] via-[#0f0404] to-black"></div>

      {/* 2. Starfield Effect */}
      <div className="absolute inset-0 opacity-40" style={{ 
        backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
        backgroundSize: '50px 50px' 
      }}></div>

      {/* 3. Central System Container */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        
        {/* Central Planet (The Mystic Sphere) */}
        <div className="relative w-[35vh] h-[35vh] md:w-[45vh] md:h-[45vh] rounded-full shadow-[0_0_80px_rgba(200,50,50,0.15)]">
           {/* Planet Surface */}
           <div className="absolute inset-0 rounded-full bg-gradient-to-br from-maroon-900 via-black to-[#0a0510] overflow-hidden opacity-90">
             <div className="absolute inset-0 bg-saffron-500/5 mix-blend-overlay"></div>
           </div>
           
           {/* Atmosphere/Glow */}
           <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-saffron-900/20 to-transparent blur-md"></div>
           <div className="absolute inset-0 rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.8)]"></div>
        </div>

        {/* Orbit 1 (Innermost) */}
        <div className="absolute w-[50vh] h-[50vh] md:w-[60vh] md:h-[60vh] rounded-full border border-saffron-500/5 animate-[spin_40s_linear_infinite]">
          <div className="absolute top-1/2 -right-2 w-3 h-3 bg-saffron-600 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.6)]"></div>
        </div>

        {/* Orbit 2 */}
        <div className="absolute w-[65vh] h-[65vh] md:w-[80vh] md:h-[80vh] rounded-full border border-saffron-500/5 animate-[spin_65s_linear_infinite_reverse]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-6 h-6 bg-red-900 rounded-full shadow-[0_0_15px_rgba(153,27,27,0.5)] border border-red-800/50"></div>
        </div>

        {/* Orbit 3 */}
        <div className="absolute w-[85vh] h-[85vh] md:w-[110vh] md:h-[110vh] rounded-full border border-white/5 animate-[spin_100s_linear_infinite]">
           <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-900/80 rounded-full blur-[1px]"></div>
        </div>

        {/* Orbit 4 (Outermost) */}
        <div className="absolute w-[110vh] h-[110vh] md:w-[140vh] md:h-[140vh] rounded-full border border-saffron-500/5 animate-[spin_150s_linear_infinite_reverse] opacity-50">
           <div className="absolute top-0 right-1/2 w-2 h-2 bg-saffron-200 rounded-full shadow-[0_0_10px_white]"></div>
        </div>

      </div>
    </div>
  );
};