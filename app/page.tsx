import { getAssets } from '@/lib/loadAssets';
import AssetTable from '@/components/AssetTable';
import RiskChart from '@/components/RiskChart';
import RiskMap from '@/components/RiskMap';

export default function Home() {
  const assets = getAssets();

  // Tính toán số liệu thống kê tự động (đảm bảo khớp 100% giữa các section)
  const totalBridges = assets.length;
  const severeCount = assets.filter(a => (a.Load_Limit_Band || '').toLowerCase().includes('severe')).length;
  const notesCount = assets.filter(a => a.Notes && a.Notes !== 'None').length;
  const severePercentage = totalBridges > 0 ? Math.round((severeCount / totalBridges) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold rounded-full mb-2">
              Sample Scope: {totalBridges} Records (State Growth Open Data)
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Tasmanian Load-Limited Bridges Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Exploring heavy-vehicle load restrictions on Tasmanian bridges using Department of State Growth open data.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/hnphuongdoan/tas-risk-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors shadow-md whitespace-nowrap"
            >
              GitHub Repository →
            </a>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            EXECUTIVE SUMMARY
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            In this sample of {totalBridges} load-limited bridges, <strong>{severeCount} ({severePercentage}%)</strong> are restricted to 5 t or less. Load limits show legal restrictions, not structural condition. This is a convenience sample, non-random, so figures describe these {totalBridges} bridges only.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <p className="text-xs text-slate-400 uppercase font-medium">Load-limited bridges (sample)</p>
            <p className="text-3xl font-extrabold text-white mt-2">{totalBridges}</p>
            <p className="text-[11px] text-slate-500 mt-1">Convenience sample (non-random)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <p className="text-xs text-slate-400 uppercase font-medium">Legal limit of 5 t or less</p>
            <p className="text-3xl font-extrabold text-rose-400 mt-2">{severeCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Severe restriction band (≤ 5t)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <p className="text-xs text-slate-400 uppercase font-medium">Extra Conditions / Notes</p>
            <p className="text-3xl font-extrabold text-amber-400 mt-2">{notesCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Bridges with axle or speed limits</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <p className="text-xs text-slate-400 uppercase font-medium">Data Source</p>
            <p className="text-sm font-bold text-white mt-2">Dept. of State Growth</p>
            <a 
              href="https://creativecommons.org/licenses/by/4.0/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-sky-400 hover:underline mt-1 inline-block"
            >
              CC BY 4.0 International
            </a>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
          <RiskChart assets={assets} />
        </div>

        {/* Map Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
          <div className="h-[450px] w-full rounded-lg overflow-hidden border border-slate-800">
            <RiskMap assets={assets} />
          </div>
        </div>

        {/* Table Section */}
        <AssetTable assets={assets} />

        {/* Methodology & Data Limitations Box */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl space-y-3 text-xs text-slate-400">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">METHODOLOGY & DATA LIMITATIONS</h3>
          <p>
            <strong className="text-slate-300">Data Source:</strong> Tasmanian Load Limited Bridges and Roads (load-limit bridges layer), Department of State Growth (Tasmania), CC BY 4.0. Retrieved 13 Oct 2026.
          </p>
          <p>
            <strong className="text-slate-300">Scope:</strong> First {totalBridges} records in source layer ordered by Object ID (<span className="font-mono text-xs text-sky-400 break-all">resultRecordCount={totalBridges}&orderByFields=OBJECTID</span>). This is a convenience sample, non-random.
          </p>
          <p>
            <strong className="text-slate-300">Units & Classification Bands:</strong> Load limits are assumed to be in tonnes. Bands defined as: Severe (≤ 5 t), Moderate (6–20 t), Light (&gt; 20 t). These are the author&apos;s own groupings and not an official departmental classification.
          </p>
          <p>
            <strong className="text-slate-300">Data Quality & Limitations:</strong> Some roads and bridges are unnamed in the source layer. Limits reflect legal operating restrictions only, with no condition, age, traffic volume, or freight-route data attached.
          </p>
        </div>

        {/* Footer */}
        <footer className="pt-4 pb-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2 pl-8 md:pl-0">
          <p>Designed & Developed by Nguyen Phuong Doan Ho | Infrastructure Portfolio</p>
          <p>Data: Department of State Growth (Tasmania), CC BY 4.0. Filtered and banded by the author.</p>
        </footer>

      </div>
    </main>
  );
}