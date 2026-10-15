'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Asset } from '@/types/asset';

interface RiskChartProps {
  assets: Asset[];
}

export default function RiskChart({ assets }: RiskChartProps) {
  // Đếm số lượng một cách linh hoạt dựa trên từ khóa trong Load_Limit_Band hoặc Load_Limit_Tonnes
  let severeCount = 0;
  let moderateCount = 0;
  let lightCount = 0;

  assets.forEach((asset) => {
    const band = (asset.Load_Limit_Band || '').toLowerCase();
    const tonnes = Number(asset.Load_Limit_Tonnes ?? asset.Load_Limit_t ?? 999);

    if (band.includes('severe') || tonnes <= 5) {
      severeCount++;
    } else if (band.includes('moderate') || (tonnes > 5 && tonnes <= 20)) {
      moderateCount++;
    } else {
      lightCount++;
    }
  });

  const data = [
    { band: 'Severe (≤ 5t)', count: severeCount, color: '#f43f5e' },
    { band: 'Moderate (6–20t)', count: moderateCount, color: '#f59e0b' },
    { band: 'Light (> 20t)', count: lightCount, color: '#10b981' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-100">Bridge Distribution by Load Limit Band</h3>
        <p className="text-xs text-slate-400 mt-1">Sample breakdown across categorical restriction thresholds.</p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="band" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}