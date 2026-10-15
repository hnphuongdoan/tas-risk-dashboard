'use client';

import { useState, useMemo } from 'react';
import { Asset } from '@/types/asset';

interface AssetTableProps {
  assets: Asset[];
}

type SortField = 'Bridge_Number' | 'Bridge_Name' | 'Road_Name' | 'Asset_Owner' | 'Load_Limit_Tonnes' | 'Load_Limit_Band';
type SortOrder = 'asc' | 'desc';

export default function AssetTable({ assets }: AssetTableProps) {
  const [sortField, setSortField] = useState<SortField>('Load_Limit_Tonnes');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBand, setSelectedBand] = useState<string>('ALL');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          String(asset.Bridge_Number || '').toLowerCase().includes(query) ||
          String(asset.Bridge_Name || '').toLowerCase().includes(query) ||
          String(asset.Road_Name || '').toLowerCase().includes(query) ||
          String(asset.Asset_Owner || '').toLowerCase().includes(query) ||
          String(asset.Notes || '').toLowerCase().includes(query);

        const assetBand = (asset.Load_Limit_Band || '').toLowerCase();
        const matchesBand = 
          selectedBand === 'ALL' || 
          (selectedBand === 'Severe' && assetBand.includes('severe')) ||
          (selectedBand === 'Moderate' && assetBand.includes('moderate')) ||
          (selectedBand === 'Light' && assetBand.includes('light'));

        return matchesSearch && matchesBand;
      })
      .sort((a, b) => {
        let aVal: any = a[sortField as keyof Asset] ?? '';
        let bVal: any = b[sortField as keyof Asset] ?? '';

        if (sortField === 'Load_Limit_Tonnes') {
          aVal = Number(aVal) || 999;
          bVal = Number(bVal) || 999;
        } else {
          aVal = String(aVal);
          bVal = String(bVal);
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [assets, sortField, sortOrder, searchTerm, selectedBand]);

  const handleExportCSV = () => {
    const headers = ['Bridge_Number', 'Bridge_Name', 'Road_Name', 'Asset_Owner', 'Load_Limit_Tonnes', 'Load_Limit_Band', 'Notes', 'Latitude', 'Longitude'];
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
    link.setAttribute('download', `tasmanian_bridges_sample_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Tasmanian Bridge Asset Inventory</h3>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredAndSortedAssets.length} of {assets.length} sample records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Band Filter Buttons */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['ALL', 'Severe', 'Moderate', 'Light'].map((band) => (
              <button
                key={band}
                onClick={() => setSelectedBand(band)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedBand === band ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {band}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search bridge, road, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500 w-full md:w-56"
          />

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th onClick={() => handleSort('Bridge_Number')} className="p-3 cursor-pointer hover:text-white">Bridge No.</th>
              <th onClick={() => handleSort('Bridge_Name')} className="p-3 cursor-pointer hover:text-white">Bridge Name</th>
              <th onClick={() => handleSort('Road_Name')} className="p-3 cursor-pointer hover:text-white">Road Name</th>
              <th onClick={() => handleSort('Asset_Owner')} className="p-3 cursor-pointer hover:text-white">Owner</th>
              <th onClick={() => handleSort('Load_Limit_Tonnes')} className="p-3 cursor-pointer hover:text-white">Limit (t)</th>
              <th onClick={() => handleSort('Load_Limit_Band')} className="p-3 cursor-pointer hover:text-white">Band</th>
              <th className="p-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredAndSortedAssets.length > 0 ? (
              filteredAndSortedAssets.map((asset, index) => {
                const band = (asset.Load_Limit_Band || '').toLowerCase();
                const badgeColor = band.includes('severe')
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : band.includes('moderate')
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                return (
                  <tr key={`asset-row-${index}`} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{asset.Bridge_Number}</td>
                    <td className="p-3 font-semibold text-slate-200">{asset.Bridge_Name}</td>
                    <td className="p-3 text-slate-400">{asset.Road_Name}</td>
                    <td className="p-3 text-slate-400">{asset.Asset_Owner}</td>
                    <td className="p-3 font-mono font-bold text-sky-400">{asset.Load_Limit_Tonnes}t</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                        {asset.Load_Limit_Band}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 italic max-w-xs truncate">{asset.Notes || 'None'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-slate-500">No matching records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}