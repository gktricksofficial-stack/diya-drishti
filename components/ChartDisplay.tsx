
import React from 'react';
import { ChartResponse, PlanetData } from '../types';
import { Download } from 'lucide-react';

interface ChartDisplayProps {
  data: ChartResponse;
  onDownload?: () => void;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, onDownload }) => {

  return (
    <div id="chart-report" className="w-full bg-maroon-900/30 backdrop-blur-md border border-saffron-900/30 rounded-xl overflow-hidden shadow-xl print:bg-white print:border-gray-300 print:shadow-none">
      <div className="bg-maroon-900/60 px-6 py-4 border-b border-saffron-900/30 flex justify-between items-center print:bg-white print:border-b-2 print:border-gray-400">
        <div>
           <h3 className="text-xl font-serif text-saffron-400 print:text-black">जन्म कुण्डली (Janma Kundali)</h3>
           <span className="text-xs text-saffron-600 bg-saffron-900/20 px-2 py-1 rounded print:text-gray-700 print:bg-gray-100 print:border print:border-gray-300">Lahiri Ayanamsa: {data.ayanamsa.toFixed(2)}°</span>
        </div>
        <button
            onClick={onDownload}
            data-html2canvas-ignore
            className="p-2 bg-saffron-900/20 hover:bg-saffron-900/40 text-saffron-400 rounded-lg transition-colors print:hidden"
            title="Download Chart PDF"
        >
            <Download size={18} />
        </button>
      </div>
      
      <div className="p-0 overflow-x-auto">
        <h4 className="text-lg font-serif text-saffron-400 mb-3 px-6 print:text-black">1. ग्रह स्थिति (Planetary Positions)</h4>
        <table className="w-full text-left">
          <thead>
            <tr className="text-saffron-600 text-xs uppercase tracking-wider bg-black/20 print:text-gray-800 print:bg-gray-100">
              <th className="px-6 py-3 font-medium">ग्रह (Planet)</th>
              <th className="px-6 py-3 font-medium">राशि (Sign)</th>
              <th className="px-6 py-3 font-medium">भाव (House)</th>
              <th className="px-6 py-3 font-medium">अंश (Degree)</th>
              <th className="px-6 py-3 font-medium">स्थिति (Status)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saffron-900/20 print:divide-gray-300">
            <tr className="hover:bg-saffron-900/10 transition-colors print:hover:bg-gray-50">
                <td className="px-6 py-3 font-serif text-saffron-200 print:text-black">{data.ascendant.name}</td>
                <td className="px-6 py-3 text-saffron-100 print:text-gray-800">{data.ascendant.sign}</td>
                <td className="px-6 py-3 text-saffron-300 print:text-gray-700">1</td>
                <td className="px-6 py-3 text-saffron-300 font-mono print:text-gray-800">{data.ascendant.degree.toFixed(2)}°</td>
                <td className="px-6 py-3">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/40 text-green-200 print:bg-green-100 print:text-green-800 print:border print:border-green-300">
                    लग्न (Lagna)
                  </span>
                </td>
            </tr>
            {data.planets.map((planet) => (
              <tr key={planet.name} className="hover:bg-saffron-900/10 transition-colors print:hover:bg-gray-50">
                <td className="px-6 py-3 font-serif text-saffron-200 print:text-black">{planet.name}</td>
                <td className="px-6 py-3 text-saffron-100 print:text-gray-800">{planet.sign}</td>
                <td className="px-6 py-3 text-saffron-300 print:text-gray-700">{planet.house}</td>
                <td className="px-6 py-3 text-saffron-300 font-mono print:text-gray-800">{planet.degree.toFixed(2)}°</td>
                <td className="px-6 py-3">
                  {planet.is_retrograde && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/40 text-red-200 print:bg-red-100 print:text-red-800 print:border print:border-red-300">
                      वक्री (Retrograde)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Simple South Indian Chart Visual Representation (Grid) */}
      <div className="p-6 border-t border-saffron-900/30 print:border-t-2 print:border-gray-400">
        <h4 className="text-lg font-serif text-saffron-400 mb-4 text-center print:text-black">2. राशि चक्र (Rasi Chart)</h4>
        <div className="aspect-square w-full max-w-[300px] mx-auto border-2 border-saffron-600 grid grid-cols-4 grid-rows-4 text-[10px] text-saffron-200 font-bold print:border-gray-800 print:text-black">
            {/* Outer perimeter logic for South Indian chart is complex to render dynamically in simple grid,
                rendering a simplified abstract version */}
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">मीन
                <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 12)}
                </div>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">मेष
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 1)}
                </div>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">वृषभ
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 2)}
                </div>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">मिथुन
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 3)}
                </div>
            </div>

            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">कुंभ
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 11)}
                </div>
            </div>
            <div className="col-span-2 row-span-2 flex items-center justify-center border border-saffron-800 bg-black/20 print:border-gray-400 print:bg-gray-100">
                <span className="text-2xl font-serif text-saffron-800 opacity-50 print:text-gray-600">राशि</span>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">कर्क
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 4)}
                </div>
            </div>

            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">मकर
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 10)}
                </div>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">सिंह
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 5)}
                </div>
            </div>

            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">धनु
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 9)}
                </div>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">वृश्चिक
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 8)}
                </div>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">तुला
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 7)}
                </div>
            </div>
            <div className="border border-saffron-800 p-1 flex items-center justify-center relative print:border-gray-400">कन्या
                 <div className="absolute text-[8px] font-normal text-white inset-0 flex flex-wrap content-center justify-center p-1 gap-1 print:text-gray-800">
                     {getPlanetsInSign(data, 6)}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const getPlanetsInSign = (data: ChartResponse, signId: number) => {
    const list: string[] = [];
    if (data.ascendant.sign_id === signId) list.push("ASC");
    data.planets.forEach(p => {
        if (p.sign_id === signId) {
            list.push(p.name.substring(0, 2));
        }
    });
    return list.map((s, i) => <span key={i} className="bg-saffron-900/80 px-1 rounded print:bg-gray-200 print:text-gray-800 print:border print:border-gray-400">{s}</span>);
};
