'use client';

import { useState, useMemo } from 'react';
import { Asset } from '@/types/asset';

interface AssetTableProps {
  assets: Asset[];
}

type SortField = 'Bridge_Number' | 'Bridge_Name' | 'Road_Name' | 'Asset_Owner' | 'Load_Limit_Band';
type SortOrder = 'asc' | 'desc';

export default function AssetTable({ assets }: AssetTableProps) {
  const [sortField, setSortField] = useState<SortField>('Bridge_Number');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sorting logic
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const query = searchTerm.toLowerCase();
        return (
          String(asset.Bridge_Number || '').toLowerCase().includes(query) ||
          String(asset.Bridge_Name || '').toLowerCase().includes(query) ||
          String(asset.Road_Name || '').toLowerCase().includes(query) ||
          String(asset.Asset_Owner || '').toLowerCase().includes(query) ||
          String(asset.Load_Limit_Band || '').toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aVal = String(a[sortField] || '');
        const bVal = String(b[sortField] || '');
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [assets, sortField, sortOrder, searchTerm]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Bridge_Number', 'Bridge_Name', 'Road_Name', 'Asset_Owner', 'Load_Limit_Band', 'Latitude', 'Longitude'];
    const csvRows = [
      headers.join(','),
      ...filteredAndSortedAssets.map((asset) =>
        headers.map((field) => `"${String(asset[field as keyof Asset] || '')}"`).join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tasmanian_bridges_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Tasmanian Bridge Asset Inventory</h3>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredAndSortedAssets.length} of {assets.length} records. Click headers to sort.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500 w-full md:w-64"
          />

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th onClick={() => handleSort('Bridge_Number')} className="p-3 cursor-pointer hover:text-white transition-colors">
                Bridge No. {sortField === 'Bridge_Number' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('Bridge_Name')} className="p-3 cursor-pointer hover:text-white transition-colors">
                Bridge Name {sortField === 'Bridge_Name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('Road_Name')} className="p-3 cursor-pointer hover:text-white transition-colors">
                Road Name {sortField === 'Road_Name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('Asset_Owner')} className="p-3 cursor-pointer hover:text-white transition-colors">
                Asset Owner {sortField === 'Asset_Owner' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('Load_Limit_Band')} className="p-3 cursor-pointer hover:text-white transition-colors">
                Load Limit Band {sortField === 'Load_Limit_Band' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredAndSortedAssets.length > 0 ? (
              filteredAndSortedAssets.map((asset, index) => (
                <tr key={`asset-row-${index}`} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-mono font-medium text-sky-400">{asset.Bridge_Number}</td>
                  <td className="p-3 font-semibold text-slate-200">{asset.Bridge_Name}</td>
                  <td className="p-3 text-slate-400">{asset.Road_Name}</td>
                  <td className="p-3 text-slate-400">{asset.Asset_Owner}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        (asset.Load_Limit_Band || '').toLowerCase().includes('severe')
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {asset.Load_Limit_Band}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-slate-500">
                  No matching bridge assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}