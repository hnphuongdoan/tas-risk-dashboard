import { getAssets } from '@/lib/loadAssets';
import { Asset } from '@/types/asset';
import AssetTable from '@/components/AssetTable';
import RiskChart from '@/components/RiskChart';
import RiskMap from '@/components/RiskMap';

export default async function Home() {
  const assets: Asset[] = await getAssets();

  // Quick statistics for Executive Summary
  const totalBridges = assets.length;
  const severeBridges = assets.filter((a: Asset) => (a.Load_Limit_Band || '').toLowerCase().includes('severe')).length;
  const severePercentage = totalBridges > 0 ? Math.round((severeBridges / totalBridges) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Tasmanian Infrastructure Risk Analytics
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Regulatory load-limit compliance monitoring and spatial asset overview.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Sample Scope: 20 Records
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

        {/* 1. EXECUTIVE SUMMARY / "SO WHAT?" LAYER */}
        <section className="bg-slate-900 border border-sky-500/30 p-5 rounded-xl shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 mb-1">
            Executive Summary & Decision Support
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Analysis of the sampled dataset indicates that <strong className="text-white">{severePercentage}% ({severeBridges} of {totalBridges} bridges)</strong> are under severe load restrictions (&le; 5t), primarily concentrated in regional council areas. This highlights potential heavy-vehicle freight bottlenecks on connector routes requiring targeted structural audits.
          </p>
        </section>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Monitored Assets (Sample)</h3>
            <p className="text-3xl font-bold text-sky-400">{totalBridges}</p>
            <p className="text-xs text-slate-500 mt-1">First 20 records of dataset</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Severe Restrictions (&le; 5t)</h3>
            <p className="text-3xl font-bold text-rose-400">{severeBridges}</p>
            <p className="text-xs text-slate-500 mt-1">Requires immediate freight route planning</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Data Source & License</h3>
            <p className="text-sm font-bold text-slate-200 mt-1">Department of State Growth</p>
            <p className="text-xs text-sky-400 mt-1">CC BY 4.0 International</p>
          </div>
        </div>

        {/* Analytics & Visualizations */}
        <RiskChart assets={assets} />
        <RiskMap assets={assets} />
        <AssetTable assets={assets} />

        {/* Clean Professional Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          {/* Methodology & Limitations first */}
          <div className="text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Methodology & Limitations:</strong> Derived from the Tasmanian Load-Limited Bridges dataset (Retrieved: October 2026). Load limits represent legal regulatory operating restrictions rather than structural failures. This dashboard serves as a portfolio demonstration.
          </div>

          {/* Author Name under Methodology */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-slate-900/80 pt-3">
            <p>
              <strong className="text-slate-200">Designed & Developed by Nguyen Phuong Doan Ho</strong> | Infrastructure Risk Analytics Portfolio
            </p>
            <p className="text-slate-500">
              Licensed under <span className="text-slate-400 font-medium">CC BY 4.0 International</span>
            </p>
          </div>
        </footer>

      </div>
    </main>
  );
}