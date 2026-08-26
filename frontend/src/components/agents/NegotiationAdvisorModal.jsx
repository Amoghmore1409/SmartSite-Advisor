import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Handshake, Sparkles, DollarSign, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { agentAPI } from '../../services/api';

export default function NegotiationAdvisorModal({ isOpen, onClose, property }) {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);

  const fetchStrategy = async () => {
    if (!property) return;
    setLoading(true);
    try {
      const response = await agentAPI.strategizeNegotiation({
        property,
        buyerBudget: property.price
      });
      if (response.data?.success) {
        setStrategy(response.data.data);
      }
    } catch (err) {
      console.error("Negotiation strategy error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && property && !strategy) {
      fetchStrategy();
    }
  }, [isOpen, property]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Handshake size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles size={14} /> Negotiation Deal Strategist Agent
              </div>
              <h3 className="text-xl font-black text-white">Deal Counter-Offer Blueprint</h3>
            </div>
          </div>

          {loading && (
            <div className="py-12 text-center">
              <RefreshCw size={32} className="animate-spin text-emerald-400 mx-auto mb-3" />
              <p className="text-xs text-slate-400">NegotiationAgent calculating optimal target offer & EMI outlays...</p>
            </div>
          )}

          {strategy && !loading && (
            <div className="space-y-6">
              {/* Savings Card */}
              <div className="bg-gradient-to-r from-emerald-950 to-slate-900 p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Target Counter Offer</div>
                  <div className="text-2xl font-black text-emerald-400">₹{strategy.recommendedCounterOffer?.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">List Price: ₹{strategy.listPrice?.toLocaleString('en-IN')}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">Potential Savings</div>
                  <div className="text-xl font-bold text-white">{strategy.estimatedSavingsAmount}</div>
                  <div className="text-[11px] text-emerald-400 font-bold mt-0.5">Estimated EMI: {strategy.estimatedEMI}</div>
                </div>
              </div>

              {/* Tactics list */}
              <div>
                <h4 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" /> Step-by-Step Negotiation Script
                </h4>
                <div className="space-y-2.5">
                  {strategy.negotiationTactics?.map((tactic, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">{tactic}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closing Advice */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold text-indigo-400 uppercase mb-1">Agent Closing Advice</div>
                <p className="text-xs text-slate-300 leading-relaxed">{strategy.closingAdvice}</p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                Got It - Apply Strategy
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
