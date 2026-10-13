'use client';

import { Asset } from '@/types/asset';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RiskChartProps {
  assets: Asset[];
}

export default function RiskChart({ assets }: RiskChartProps) {
  // Gom nhóm dữ liệu tính tổng Replacement Cost theo từng Category
  const categoryDataMap = assets.reduce((acc: { [key: string]: number }, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + asset.replacement_cost_m;
    return acc;
  }, {});

  const chartData = Object.keys(categoryDataMap).map((cat) => ({
    category: cat,
    cost: Number(categoryDataMap[cat].toFixed(1)),
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8">
      <h3 className="text-lg font-bold text-slate-100 mb-4">Total Replacement Cost by Category ($M)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="category" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
            />
            <Bar dataKey="cost" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}