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
  
  // State quản lý Modal xem chi tiết (Cách C)
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);

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
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mb-8 relative">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Tasmanian Bridge Asset Inventory</h3>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredAndSortedAssets.length} of {assets.length} sample records. (Click any row to view full details modal)
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

                const limitValue = asset.Load_Limit_Tonnes ?? (asset as any).Load_Limit_t;

                return (
                  <tr 
                    key={`asset-row-${index}`} 
                    onClick={() => setActiveAsset(asset)}
                    className="hover:bg-slate-800/70 transition-colors cursor-pointer"
                    title="Click to view full details in Modal"
                  >
                    <td className="p-3 font-mono text-slate-400 align-top">{asset.Bridge_Number}</td>
                    <td className="p-3 font-semibold text-slate-200 align-top">{asset.Bridge_Name}</td>
                    <td className="p-3 text-slate-400 align-top">{asset.Road_Name}</td>
                    <td className="p-3 text-slate-400 align-top">{asset.Asset_Owner}</td>
                    <td className="p-3 font-mono font-bold text-sky-400 align-top">
                      {limitValue !== undefined && limitValue !== null ? `${limitValue}t` : 'N/A'}
                    </td>
                    <td className="p-3 align-top">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${badgeColor} inline-block whitespace-nowrap`}>
                        {asset.Load_Limit_Band}
                      </span>
                    </td>
                    {/* CÁCH A: Tự động xuống dòng (wrap text) bằng whitespace-normal và break-words */}
                    <td className="p-3 text-slate-300 italic min-w-[200px] max-w-xs whitespace-normal break-words align-top leading-relaxed">
                      {asset.Notes || 'None'}
                    </td>
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

      {/* CÁCH C: Modal Popup Chi Tiết khi click vào bất kỳ dòng nào */}
      {activeAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Nút đóng modal */}
            <button
              onClick={() => setActiveAsset(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-1">{activeAsset.Bridge_Name}</h3>
            <p className="text-xs text-sky-400 font-mono mb-4">Bridge No: {activeAsset.Bridge_Number}</p>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Road Name:</span>
                <span className="font-medium text-white">{activeAsset.Road_Name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Asset Owner:</span>
                <span className="font-medium text-white">{activeAsset.Asset_Owner}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Load Limit:</span>
                <span className="font-mono font-bold text-sky-400">{activeAsset.Load_Limit_Tonnes}t</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Classification Band:</span>
                <span className="font-semibold text-amber-400">{activeAsset.Load_Limit_Band}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Coordinates (Lat, Lng):</span>
                <span className="font-mono text-slate-300">{activeAsset.Latitude}, {activeAsset.Longitude}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Engineering Notes / Restrictions:</span>
                <p className="italic text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {activeAsset.Notes && activeAsset.Notes !== 'None' ? activeAsset.Notes : 'No special operational restrictions or notes recorded for this asset.'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveAsset(null)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}