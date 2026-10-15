'use client';

import dynamic from 'next/dynamic';
import { Asset } from '@/types/asset';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-sm">
      Loading interactive GIS map...
    </div>
  ),
});

interface RiskMapProps {
  assets: Asset[];
}

export default function RiskMap({ assets }: RiskMapProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Bridge Spatial Distribution (Interactive Map)</h3>
        <p className="text-xs text-slate-400 mt-1">
          Geospatial mapping of Tasmanian load-limited assets based on WGS84 coordinates. Click markers for metadata popups.
        </p>
      </div>

      <LeafletMap assets={assets} />
    </div>
  );
}