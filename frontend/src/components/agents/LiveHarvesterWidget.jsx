import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, RefreshCw, CheckCircle2, ShieldCheck, Search, Sparkles, MapPin } from 'lucide-react';
import { agentAPI } from '../../services/api';

export default function LiveHarvesterWidget({ onHarvestComplete }) {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleHarvest = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSyncStatus(null);
    try {
      const response = await agentAPI.harvestListings({
        city: selectedCity,
        locality: locality || undefined,
        limit: 10
      });

      if (response.data?.success) {
        setSyncStatus(response.data.data);
        if (onHarvestComplete) {
          onHarvestComplete(response.data.data);
        }
      }
    } catch (err) {
      console.error("Live harvester error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-base p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden my-6">
      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              Autonomous Scraper Agent
            </span>
            <span className="text-xs text-gray-400">Live source: MagicBricks (Housing.com &amp; 99acres block automated access)</span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            Live Property Data Harvester <Sparkles className="w-5 h-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Fetch & sync verified live market property listings across <span className="text-emerald-300 font-semibold">Mumbai, Thane & Navi Mumbai</span>.
          </p>
        </div>

        <button
          onClick={() => handleHarvest()}
          disabled={loading}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              Harvesting Portal Data...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-slate-950" />
              Run Live Portal Scrape
            </>
          )}
        </button>
      </div>

      {/* Region Selector Form */}
      <form onSubmit={handleHarvest} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Target Region</label>
          <div className="flex gap-1.5">
            {['Mumbai', 'Thane', 'Navi Mumbai'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCity(c)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  selectedCity === c
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Specific Locality (Optional)</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Lower Parel, Panvel, Juhu..."
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold rounded-lg text-xs border border-emerald-500/30 flex items-center justify-center gap-1.5 transition"
          >
            <Search className="w-3.5 h-3.5" />
            Scrape {selectedCity} Market
          </button>
        </div>
      </form>

      {/* Sync Results Banner */}
      <AnimatePresence>
        {syncStatus && (() => {
          const liveCount = (syncStatus.results || []).filter((r) => r.property?.verifiedLive).length;
          const isFullyLive = liveCount === syncStatus.count && syncStatus.count > 0;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 border rounded-xl flex items-center justify-between text-xs ${
                isFullyLive
                  ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-900/30 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 shrink-0 ${isFullyLive ? 'text-emerald-400' : 'text-amber-400'}`} />
                <div>
                  <span className="font-bold text-white">Sync Complete:</span> {syncStatus.count} listing{syncStatus.count === 1 ? '' : 's'} processed for {selectedCity}
                  {liveCount > 0 && ` (${liveCount} live from MagicBricks)`}
                  {liveCount < syncStatus.count && ` — ${syncStatus.count - liveCount} from static sample data (no live listings were available)`}.
                </div>
              </div>
              <span className={`font-mono font-bold bg-slate-950 px-2 py-1 rounded border ${
                isFullyLive ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'
              }`}>
                {isFullyLive ? '🟢 Live' : '🟡 Partial/Sample'}
              </span>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
