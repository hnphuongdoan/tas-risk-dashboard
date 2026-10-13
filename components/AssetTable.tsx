'use client';

import { useState, useMemo } from 'react';
import { Asset } from '@/types/asset';

interface AssetTableProps {
  assets: Asset[];
}

type SortField = 'Bridge_Name' | 'Load_Limit_t' | 'Load_Limit_Band';

export default function AssetTable({ assets }: AssetTableProps) {
  const [selectedBand, setSelectedBand] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('Load_Limit_t');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const bands = ['All', ...Array.from(new Set(assets.map((a) => a.Load_Limit_Band)))];

  const filteredAssets = useMemo(() => {
    return assets
      .filter((a) => {
        const matchesBand = selectedBand === 'All' || a.Load_Limit_Band === selectedBand;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          (a.Bridge_Name || '').toLowerCase().includes(searchLower) ||
          (a.Road_Name || '').toLowerCase().includes(searchLower) ||
          (a.Asset_Owner || '').toLowerCase().includes(searchLower) ||
          (a.Bridge_Number || '').toLowerCase().includes(searchLower);
        return matchesBand && matchesSearch;
      })
      .sort((a, b) => {
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;
        if (typeof valA === 'string') valA = (valA as string).toLowerCase();
        if (typeof valB === 'string') valB = (valB as string).toLowerCase();

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [assets, selectedBand, searchTerm, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getRiskBadge = (band: string) => {
    const b = (band || '').toLowerCase();
    if (b.includes('severe')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">Severe (&le; 5t)</span>;
    } else if (b.includes('moderate')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Moderate (6–20t)</span>;
    } else {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Light (&gt; 20t)</span>;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by bridge name, road, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-400 mr-2">Load Limit Band:</span>
          {bands.map((band) => (
            <button
              key={band}
              onClick={() => setSelectedBand(band)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedBand === band
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-300 text-sm">
              <th className="p-4">Bridge No</th>
              <th className="p-4 cursor-pointer hover:text-sky-400" onClick={() => handleSort('Bridge_Name')}>
                Bridge Name {sortField === 'Bridge_Name' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="p-4">Road Name</th>
              <th className="p-4">Asset Owner</th>
              <th className="p-4 cursor-pointer hover:text-sky-400" onClick={() => handleSort('Load_Limit_t')}>
                Load Limit {sortField === 'Load_Limit_t' && (sortAsc ? '▲' : '▼')}
              </th>
              <th className="p-4 cursor-pointer hover:text-sky-400" onClick={() => handleSort('Load_Limit_Band')}>
                Restriction Band {sortField === 'Load_Limit_Band' && (sortAsc ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <tr key={`${asset.Object || 'bridge'}-${index}`} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-sky-400">{asset.Bridge_Number}</td>
                  <td className="p-4 font-medium">{asset.Bridge_Name}</td>
                  <td className="p-4 text-slate-300">{asset.Road_Name}</td>
                  <td className="p-4 text-slate-400">{asset.Asset_Owner}</td>
                  <td className="p-4 font-bold">{asset.Load_Limit_t}t</td>
                  <td className="p-4">{getRiskBadge(asset.Load_Limit_Band)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No bridges found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}