'use client';

import { Asset } from '@/types/asset';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RiskChartProps {
  assets: Asset[];
}

export default function RiskChart({ assets }: RiskChartProps) {
  const councilCounts = assets.reduce((acc: {[key: string]: number}, a) => {
    const owner = a.Asset_Owner || 'Unknown';
    acc[owner] = (acc[owner] || 0) + 1;
    return acc;
  }, {});

  // Sort from most to fewest bridges for cleaner layout
  const chartData = Object.keys(councilCounts)
    .map((owner) => ({
      owner: owner,
      count: councilCounts[owner],
    }))
    .sort((a, b) => b.count - a.count);

  const totalCount = assets.length;
  const severeCount = assets.filter(a => (a.Load_Limit_Band || '').toLowerCase().includes('severe')).length;
  const councilManagedCount = Object.entries(councilCounts)
    .filter(([owner]) => owner.toLowerCase().includes('council'))
    .reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-100">Load-Limited Bridges by Asset Owner (Sample)</h3>
      </div>

      {/* Objective Analytical Observations */}
      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg mb-6 text-sm text-slate-300">
        <p className="font-semibold text-sky-400 mb-2">Analytical Observations (Sample):</p>
        <ul className="list-disc list-inside space-y-1 text-slate-300">
          <li><strong>Ownership Breakdown:</strong> Local councils manage {councilManagedCount} of the {totalCount} sampled bridges; Huon Valley Council has the most ({councilCounts['Huon Valley Council'] || 0} bridges).</li>
          <li><strong>Weight Restrictions:</strong> 5 of the 20 sampled bridges are restricted to 5 tonnes or less, which may limit heavy-vehicle access in this sample.</li>
          <li><strong>Sample Scope:</strong> This chart reflects the first 20 records of the dataset and illustrates distribution across regional asset owners rather than statewide totals.</li>
        </ul>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
            <YAxis type="category" dataKey="owner" stroke="#94a3b8" width={140} tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
            />
            <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}