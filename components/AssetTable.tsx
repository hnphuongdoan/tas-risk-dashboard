'use client';

import { useState } from 'react';
import { Asset } from '@/types/asset';

interface AssetTableProps {
  assets: Asset[];
}

export default function AssetTable({ assets }: AssetTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Lấy danh sách các categories duy nhất từ dữ liệu
  const categories = ['All', ...Array.from(new Set(assets.map((a) => a.category)))];

  // Lọc danh sách tài sản theo category được chọn
  const filteredAssets = selectedCategory === 'All' 
    ? assets 
    : assets.filter((a) => a.category === selectedCategory);

  // Hàm helper vẽ badge rủi ro
  const getRiskBadge = (score: number) => {
    if (score >= 15) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">High ({score})</span>;
    } else if (score >= 10) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Medium ({score})</span>;
    } else {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Low ({score})</span>;
    }
  };

  return (
    <div>
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm font-medium text-slate-400 mr-2">Filter by Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-300 text-sm">
              <th className="p-4">ID</th>
              <th className="p-4">Asset Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Location</th>
              <th className="p-4">Condition</th>
              <th className="p-4">Criticality</th>
              <th className="p-4">Risk Score</th>
              <th className="p-4">Replacement Cost ($M)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-sky-400">{asset.id}</td>
                  <td className="p-4 font-medium">{asset.name}</td>
                  <td className="p-4 text-slate-300">{asset.category}</td>
                  <td className="p-4 text-slate-400">{asset.location}</td>
                  <td className="p-4">{asset.condition_score}</td>
                  <td className="p-4">{asset.criticality_score}</td>
                  <td className="p-4">{getRiskBadge(asset.riskScore || 0)}</td>
                  <td className="p-4">${asset.replacement_cost_m}M</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No assets found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}