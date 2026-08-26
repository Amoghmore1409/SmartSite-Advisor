import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Bot, Award, ArrowRight, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { agentAPI } from '../../services/api';

export default function AgentDebateWidget({ properties, buyerPreferences }) {
  const [loading, setLoading] = useState(false);
  const [debateData, setDebateData] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // Round tab

  const runDebate = async () => {
    setLoading(true);
    try {
      const response = await agentAPI.runDebate({
        properties,
        buyerPreferences
      });
      if (response.data?.success) {
        setDebateData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to run agent debate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden my-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Sparkles size={14} /> Groq-Powered Multi-Agent Swarm
            </div>
            <h3 className="text-xl font-extrabold text-white">Live AI Agent Debate & Consensus Engine</h3>
          </div>
        </div>

        <button
          onClick={runDebate}
          disabled={loading}
          className="btn-primary !py-3 !px-6 text-xs flex items-center gap-2 font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Agents Debating...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Run Multi-Agent Debate</span>
            </>
          )}
        </button>
      </div>

      {/* Empty State */}
      {!debateData && !loading && (
        <div className="py-12 text-center max-w-md mx-auto">
          <MessageSquare size={48} className="text-slate-600 mx-auto mb-4" />
          <h4 className="text-base font-bold text-slate-200 mb-2">Simulate 3-Agent Real Estate Debate</h4>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Trigger our 3 specialized AI Agents (Valuation ROI, GeoSpatial Health, and Deal Strategist) to hold a live multi-round debate comparing these properties.
          </p>
          <button
            onClick={runDebate}
            className="px-6 py-2.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-slate-700 transition-all"
          >
            Start Panel Debate
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="py-16 text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h4 className="text-lg font-bold text-white mb-2">Agents standardizing metrics...</h4>
          <p className="text-xs text-slate-400">ValuationROIAgent, GeoSpatialAgent, and NegotiationAgent are debating live on Groq LLM.</p>
        </div>
      )}

      {/* Active Debate Content */}
      {debateData && !loading && (
        <div className="mt-6 space-y-8">
          {/* Winner Banner */}
          {debateData.consensusWinner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 p-6 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
                  <Award size={14} /> Agent Consensus Winner
                </div>
                <h4 className="text-2xl font-black text-white">{debateData.consensusWinner.propertyName}</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {debateData.consensusWinner.plainEnglishConsensusReasoning}
                </p>
              </div>

              <div className="flex-shrink-0 text-center bg-slate-900/80 px-6 py-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase">Match Rating</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">{debateData.consensusWinner.winningScore}/100</div>
              </div>
            </motion.div>
          )}

          {/* Debate Rounds Tabs */}
          {debateData.rounds && debateData.rounds.length > 0 && (
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
                {debateData.rounds.map((round, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === idx
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    Round {round.roundNumber}: {round.topic}
                  </button>
                ))}
              </div>

              {/* Arguments in Active Round */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {debateData.rounds[activeTab]?.agentArguments?.map((arg, aIdx) => (
                    <div
                      key={aIdx}
                      className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex items-start gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                        {arg.avatar || '🤖'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="font-bold text-white text-sm">{arg.agentTitle}</h5>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                            {arg.agentName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{arg.statement}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
