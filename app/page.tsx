import { getAssets } from '@/lib/loadAssets';
import AssetTable from '@/components/AssetTable';
import RiskChart from '@/components/RiskChart';
import RiskMap from '@/components/RiskMap';

export default function Home() {
  const assets = getAssets();

  const totalBridges = assets.length;
  const avgLoadLimit = (assets.reduce((sum, a) => sum + a.Load_Limit_t, 0) / totalBridges).toFixed(1);
  const severeCount = assets.filter((a) => (a.Load_Limit_Band || '').toLowerCase().includes('severe')).length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tasmanian Load-Limited Bridges Dashboard</h1>
          <p className="text-slate-400">Portfolio project analyzing Tasmanian load-limited infrastructure data with filtering, charts, and documented assumptions.</p>
        </header>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <p className="text-sm font-medium text-slate-400">Load-Limited Bridges (Sample)</p>
            <p className="text-3xl font-bold text-sky-400 mt-2">{totalBridges}</p>
            <p className="text-xs text-slate-500 mt-1">First 20 records of dataset</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <p className="text-sm font-medium text-slate-400">Average Load Limit</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{avgLoadLimit} tonnes</p>
            <p className="text-xs text-slate-500 mt-1">Calculated across sample of 20</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <p className="text-sm font-medium text-slate-400">Severely Restricted (&le; 5t)</p>
            <p className="text-3xl font-bold text-rose-400 mt-2">{severeCount}</p>
            <p className="text-xs text-slate-500 mt-1">Requiring weight compliance</p>
          </div>
        </div>

        {/* Visual Analytics Chart with Insights */}
        <RiskChart assets={assets} />

        {/* Geospatial Locations Component */}
        <RiskMap assets={assets} />

        {/* Interactive Asset Table with Search & Sorting */}
        <AssetTable assets={assets} />

        {/* Methodology and Limitations Section */}
        <footer className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl mt-12 text-slate-400 text-sm space-y-3 overflow-hidden">
          <h3 className="text-base font-bold text-slate-200">Methodology and Limitations</h3>
          <p>
            <strong>Data Source:</strong> Derived from the{' '}
            <a 
              href="https://researchdata.edu.au/tasmanian-load-limited-bridges-roads/3787918" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sky-400 underline hover:text-sky-300"
            >
              Tasmanian Load Limited Bridges and Roads dataset
            </a>{' '}
            published by the Department of State Growth (Tasmania) in conjunction with the National Heavy Vehicle Regulator.
          </p>
          <p>
            <strong>Licence & Attribution:</strong> Licensed under{' '}
            <a 
              href="https://creativecommons.org/licenses/by/4.0/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sky-400 underline hover:text-sky-300"
            >
              Creative Commons Attribution 4.0 International (CC BY 4.0)
            </a>. Data retrieved and parsed in 2026.
          </p>
          <p>
            <strong>Scope & Assumptions:</strong> This implementation covers a sample of the first 20 records retrieved from the live service. Load limit units are assumed to be in tonnes (inferred from axle-group descriptions). 
          </p>
          <p>
            <strong>Limitations:</strong> Load limits indicate legal operating restrictions rather than structural failures. This dashboard is designed for portfolio demonstration and decision-support simulation, not official statutory engineering evaluations.
          </p>
        </footer>
      </div>
    </main>
  );
}