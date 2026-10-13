'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Asset } from '@/types/asset';

interface RiskChartProps {
  assets: Asset[];
}

export default function RiskChart({ assets }: RiskChartProps) {
  // Aggregate data by Asset Owner
  const chartData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    assets.forEach((asset) => {
      const owner = asset.Asset_Owner || 'Unknown Owner';
      counts[owner] = (counts[owner] || 0) + 1;
    });

    return Object.keys(counts)
      .map((owner) => ({
        owner,
        count: counts[owner],
      }))
      .sort((a, b) => b.count - a.count); // Sort descending for professional layout
  }, [assets]);

  const totalSample = assets.length;
  const topOwner = chartData.length > 0 ? chartData[0] : { owner: 'N/A', count: 0 };
  const councilCount = chartData
    .filter((item) => item.owner.toLowerCase().includes('council'))
    .reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Load-Limited Bridges by Asset Owner (Sample)</h3>
        <p className="text-xs text-slate-400 mt-1">
          Distribution of restricted assets across regional and state jurisdictions.
        </p>
      </div>

      {/* Chart Container */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
            <YAxis 
              type="category" 
              dataKey="owner" 
              stroke="#94a3b8" 
              width={160} 
              interval={0} 
              tick={{ fontSize: 11, fill: '#cbd5e1' }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
              formatter={(value: any) => [`${value} bridges`, 'Restricted Assets']}
            />
            <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Observation Box */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
          Analytical Observations (Sample)
        </h4>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
          <li>
            <strong>Ownership Breakdown:</strong> Local councils manage <strong className="text-white">{councilCount} of the {totalSample}</strong> sampled bridges, with <strong className="text-white">{topOwner.owner}</strong> representing the highest frequency ({topOwner.count} bridges).
          </li>
          <li>
            <strong>Sample Scope:</strong> This chart reflects the first 20 records of the dataset, demonstrating jurisdictional concentration rather than exhaustive statewide totals.
          </li>
        </ul>
      </div>
    </div>
  );
}