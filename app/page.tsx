import { getAssets } from '@/lib/loadAssets';
import AssetTable from '@/components/AssetTable';
import RiskChart from '@/components/RiskChart';

export default function Home() {
  const assets = getAssets();

  const totalAssets = assets.length;
  const totalCost = assets.reduce((sum, a) => sum + a.replacement_cost_m, 0).toFixed(1);
  const highRiskCount = assets.filter((a) => (a.riskScore || 0) >= 15).length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Tasmanian Infrastructure Risk Dashboard</h1>
        <p className="text-slate-400 mb-6">Portfolio project demonstrating asset risk ranking & management.</p>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <p className="text-sm font-medium text-slate-400">Total Monitored Assets</p>
            <p className="text-3xl font-bold text-sky-400 mt-2">{totalAssets}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <p className="text-sm font-medium text-slate-400">Total Replacement Cost</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">${totalCost}M</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <p className="text-sm font-medium text-slate-400">High Risk Assets (Score $\ge$ 15)</p>
            <p className="text-3xl font-bold text-rose-400 mt-2">{highRiskCount}</p>
          </div>
        </div>

        {/* Visual Analytics Chart */}
        <RiskChart assets={assets} />

        {/* Interactive Asset Table with Filters */}
        <AssetTable assets={assets} />
      </div>
    </main>
  );
}