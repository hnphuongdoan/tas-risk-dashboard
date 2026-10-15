import { getAssets } from '@/lib/loadAssets';
import { Asset } from '@/types/asset';
import AssetTable from '@/components/AssetTable';
import RiskChart from '@/components/RiskChart';
import RiskMap from '@/components/RiskMap';

export default async function Home() {
  const assets: Asset[] = await getAssets();

  const totalBridges = assets.length;
  // Compute numbers dynamically in code
  const severeBridges = assets.filter((a: Asset) => (a.Load_Limit_Band || '').toLowerCase().includes('severe')).length;
  const councilManaged = assets.filter((a: Asset) => (a.Asset_Owner || '').toLowerCase().includes('council')).length;
  const severePercentage = totalBridges > 0 ? Math.round((severeBridges / totalBridges) * 100) : 0;

  // Extra insights
  const notesWithConditions = assets.filter((a: Asset) => a.Notes && a.Notes.trim().length > 0).length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Tasmanian Load-Limited Bridges Dashboard
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Exploring heavy-vehicle load restrictions on Tasmanian bridges using State Growth open data.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Sample Scope: 20 Records (first 20 of 40 in source layer, ordered by Object ID, as checked 15 Oct 2026)
              </span>
              <a 
                href="https://github.com/hnphuongdoan/tas-risk-dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                GitHub Repository &rarr;
              </a>
            </div>
          </div>
        </header>

        {/* 1. EXECUTIVE SUMMARY */}
        <section className="bg-slate-900 border border-sky-500/30 p-5 rounded-xl shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 mb-1">
            Executive Summary
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            In this sample of {totalBridges} load-limited bridges, {severeBridges} ({severePercentage}%) are restricted to 5 t or less, and {councilManaged} of {totalBridges} are council-managed. Load limits show legal restrictions, not structural condition. This is a convenience sample, not random, so figures describe these {totalBridges} bridges only.
          </p>
        </section>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Load-limited bridges (sample)</h3>
            <p className="text-3xl font-bold text-sky-400">{totalBridges}</p>
            <p className="text-xs text-slate-500 mt-1">Convenience sample (non-random)</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Legal limit of 5 t or less</h3>
            <p className="text-3xl font-bold text-rose-400">{severeBridges}</p>
            <p className="text-xs text-slate-500 mt-1">Severe restriction band (&le; 5t)</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Extra Conditions / Notes</h3>
            <p className="text-3xl font-bold text-amber-400">{notesWithConditions}</p>
            <p className="text-xs text-slate-500 mt-1">Bridges with axle or speed limits</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Data Source</h3>
            <p className="text-sm font-bold text-slate-200 mt-1">Dept. of State Growth</p>
            <p className="text-xs text-sky-400 mt-1">CC BY 4.0 International</p>
          </div>
        </div>

        {/* Analytics & Visualizations */}
        <RiskChart assets={assets} />
        <RiskMap assets={assets} />
        <AssetTable assets={assets} />

        {/* 6. VISIBLE METHODOLOGY CARD */}
        <section className="mt-12 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl text-xs text-slate-400 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Methodology & Data Limitations</h3>
          <p>
            <strong className="text-slate-300">Data Source:</strong> Tasmanian Load Limited Bridges and Roads (load-limit bridges layer), Department of State Growth (Tasmania), CC BY 4.0. Retrieved 13 Oct 2026.
          </p>
          <p>
            <strong className="text-slate-300">Scope:</strong> First 20 of 40 records in source layer ordered by Object ID (`resultRecordCount=20&orderByFields=OBJECTID`). This is a convenience sample, non-random.
          </p>
          <p>
            <strong className="text-slate-300">Units & Classification Bands:</strong> Load limits are assumed to be in tonnes. Bands defined as: Severe (&le; 5 t), Moderate (6–20 t), Light (&gt; 20 t). These are the author&apos;s own groupings and not an official departmental classification.
          </p>
          <p>
            <strong className="text-slate-300">Data Quality & Limitations:</strong> Some roads and bridges are unnamed in the source layer. Limits reflect legal operating restrictions only, with no condition, age, traffic volume, or freight-route data attached.
          </p>
        </section>

        {/* Clean Professional Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p>
            <strong className="text-slate-200">Designed & Developed by Nguyen Phuong Doan Ho</strong> | Infrastructure Portfolio
          </p>
          <p className="text-slate-500">
            Data: Department of State Growth (Tasmania), CC BY 4.0. Filtered and banded by the author.
          </p>
        </footer>

      </div>
    </main>
  );
}