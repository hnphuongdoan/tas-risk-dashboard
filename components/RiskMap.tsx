'use client';

import { Asset } from '@/types/asset';

interface RiskMapProps {
  assets: Asset[];
}

export default function RiskMap({ assets }: RiskMapProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8">
      <h3 className="text-lg font-bold text-slate-100 mb-2">Bridge Locations (Sample)</h3>
      <p className="text-xs text-slate-400 mb-4">Spatial listing of sampled Tasmanian load-limited assets based on WGS84 geographic coordinates.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
        {assets.map((asset, index) => {
          const band = (asset.Load_Limit_Band || '').toLowerCase();
          const badgeColor = band.includes('severe') 
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
            : band.includes('moderate') 
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

          return (
            <div key={`map-${asset.Object || 'bridge'}-${index}`} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-sky-400">{asset.Bridge_Number}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                    {asset.Load_Limit_Band}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-slate-200 mb-1">{asset.Bridge_Name}</h4>
                <p className="text-xs text-slate-400">{asset.Road_Name}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-900 flex justify-between text-xs text-slate-500 font-mono">
                <span>Lat: {asset.Latitude}</span>
                <span>Lon: {asset.Longitude}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}