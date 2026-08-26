import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Hammer, DollarSign, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { agentAPI } from '../../services/api';

export default function ConstructorUpgradeWidget({ property }) {
  const [loading, setLoading] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState(null);

  const fetchUpgradePlan = async () => {
    if (!property) return;
    setLoading(true);
    try {
      const response = await agentAPI.evaluateUpgrade({ property });
      if (response.data?.success) {
        setUpgradePlan(response.data.data);
      }
    } catch (err) {
      console.error("Upgrade plan error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Hammer size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles size={14} /> Constructor Upgrade Agent
            </div>
            <h3 className="text-xl font-extrabold text-white">AI Property Valuation Booster</h3>
          </div>
        </div>

        <button
          onClick={fetchUpgradePlan}
          disabled={loading}
          className="px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
          <span>Generate ROI Upgrade Plan</span>
        </button>
      </div>

      {!upgradePlan && !loading && (
        <div className="py-8 text-center text-xs text-slate-400">
          Click "Generate ROI Upgrade Plan" to analyze this property's features and receive high-yield improvement recommendations.
        </div>
      )}

      {loading && (
        <div className="py-12 text-center">
          <RefreshCw size={28} className="animate-spin text-amber-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">ConstructorUpgradeAgent analyzing listing for maximum valuation uplift...</p>
        </div>
      )}

      {upgradePlan && !loading && (
        <div className="mt-6 space-y-6">
          {/* Summary Banner */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase">Valuation Potential Uplift</div>
              <div className="text-2xl font-black text-white">{upgradePlan.estimatedPriceUplift}</div>
              <p className="text-xs text-slate-300 mt-1">{upgradePlan.sellerSummary}</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900 px-5 py-3 rounded-xl border border-slate-800 flex-shrink-0">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Current Score</div>
                <div className="text-xl font-bold text-slate-300">{upgradePlan.currentPropertyScore}</div>
              </div>
              <div className="text-amber-400 font-bold text-sm">➔</div>
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Target Score</div>
                <div className="text-2xl font-black text-amber-400">{upgradePlan.potentialScoreAfterUpgrades}</div>
              </div>
            </div>
          </div>

          {/* Upgrade Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upgradePlan.priorityUpgrades?.map((item, idx) => (
              <div key={idx} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h5 className="font-bold text-white text-sm">{item.title}</h5>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {item.scoreImpact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">{item.description}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Est. Cost: {item.costEstimate}</span>
                  <span className="text-amber-400">ROI: {item.roiMultiplier}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
