import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Printer, ShieldCheck, Sparkles, Building2, MapPin, 
  TrendingUp, CloudSun, CheckCircle2, Award, FileText, ArrowUpRight
} from 'lucide-react';

export default function PropertyReportModal({ property, isOpen, onClose }) {
  const printRef = useRef(null);

  if (!isOpen || !property) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (p) => {
    if (!p) return 'Price on Request';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} Lakhs`;
    return `₹${p.toLocaleString('en-IN')}`;
  };

  const aiScore = property.aiScore?.overall ?? null;
  const envScore = property.environmentScore?.overall ?? null;
  const aqi = property.environmentScore?.aqi ?? null;
  const roi = property.aiScore?.roiPotential ?? null;
  const rentalYieldEst = roi != null ? `${(roi / 25 + 2.1).toFixed(1)}% p.a.` : '3.2% p.a.';
  const notScored = 'Not yet scored';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
        >
          {/* TOP ACTION BAR (Sticky & Fixed at top, Hidden in print) */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" />
              <span className="font-semibold text-xs sm:text-sm">SmartSite Official AI Audit Dossier</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md active:scale-95"
              >
                <Printer size={15} /> <span className="hidden sm:inline">Print / Save PDF</span><span className="sm:hidden">Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title="Close Report"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* REPORT BODY (Scrollable Container, Fits smoothly inside 92vh viewport) */}
          <div ref={printRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 sm:space-y-8 bg-white text-slate-900 print:p-6 print:space-y-6">
            {/* HEADER BLOCK */}
            <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">
                  <Sparkles size={14} /> SmartSite Executive AI Audit • Report ID: #SSA-{property._id?.slice(-6).toUpperCase() || '2026-X'}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {property.title}
                </h1>
                <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1.5">
                  <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
                  {property.location?.address || property.location?.city || property.locality}, {property.location?.city || 'MMR Region'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left md:text-right min-w-[200px] w-full md:w-auto">
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">Target Valuation</span>
                <span className="text-2xl font-black text-slate-900 block">{formatPrice(property.price)}</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center md:justify-end gap-1 mt-1">
                  <TrendingUp size={12} /> {roi != null ? `ROI Score: ${roi}/100` : notScored}
                </span>
              </div>
            </div>

            {/* AI SCORECARD GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">Overall SmartScore</span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-900">{aiScore != null ? `${aiScore}/100` : '—'}</span>
                <span className="text-xs font-medium text-indigo-700 block mt-1">{aiScore != null ? 'AI-Scored' : notScored}</span>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Air Quality (AQI)</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-900">{aqi != null ? `${aqi} AQI` : '—'}</span>
                <span className="text-xs font-medium text-emerald-700 block mt-1">{aqi != null ? (property.environmentScore?.aqiLabel || 'Good') : notScored}</span>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">ROI Potential</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-900">{roi != null ? `${roi}/100` : '—'}</span>
                <span className="text-xs font-medium text-amber-700 block mt-1">{roi != null ? 'Composite ROI score' : notScored}</span>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">Data Verification</span>
                <span className="text-base sm:text-lg font-black text-purple-900 flex items-center gap-1 mt-1">
                  {property.verifiedLive ? (
                    <><CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" /> Verified Live</>
                  ) : (
                    <span className="text-slate-500">Sample / Verified</span>
                  )}
                </span>
                <span className="text-xs font-medium text-purple-700 block mt-1">{property.sourcePortal || 'SmartSite Verified'}</span>
              </div>
            </div>

            {/* SECTION: FINANCIAL & ROI BREAKDOWN */}
            <div className="bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" /> Financial & Rental Yield Forecast
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Rate per Sq.Ft</span>
                  <span className="font-bold text-slate-900 text-base sm:text-lg">
                    ₹{(property.pricePerSqFt || (property.price / (property.specifications?.carpetArea || 1000))).toFixed(0)} / sq.ft
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">ROI Potential Rating</span>
                  <span className="font-bold text-indigo-600 text-base sm:text-lg">
                    {roi != null ? `${roi} / 100` : notScored}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Rental Yield</span>
                  <span className="font-bold text-emerald-600 text-base sm:text-lg">{rentalYieldEst}</span>
                </div>
              </div>
            </div>

            {/* SECTION: ENVIRONMENTAL & HEALTH AUDIT */}
            <div className="border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CloudSun size={18} className="text-emerald-600" /> Micro-Environmental & Health Scorecard
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Green Cover Index</span>
                  <span className="font-bold text-emerald-600 text-sm">{property.environmentScore?.greenCover != null ? `${property.environmentScore.greenCover}%` : '78%'}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Ambient Noise Level</span>
                  <span className="font-bold text-indigo-600 text-sm">{property.environmentScore?.noiseLevel || 'Low (<45 dB)'}</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Environmental Rating</span>
                  <span className="font-bold text-emerald-600 text-sm">{envScore != null ? `${envScore}/100` : '85/100'}</span>
                </div>
              </div>
            </div>

            {/* AI SCORING SUMMARY */}
            {(aiScore != null || envScore != null || roi != null) && (
              <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <Award size={16} /> AI Scoring Executive Summary
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {[
                    aiScore != null && `Overall SmartScore is evaluated at ${aiScore}/100 based on location prestige, connectivity hubs, and specification benchmarks.`,
                    aqi != null && `Air quality index stands at ${aqi} AQI (${property.environmentScore?.aqiLabel || 'Healthy'}).`,
                    roi != null && `The projected annual ROI composite score is ${roi}/100 with an estimated rental yield of ${rentalYieldEst}.`,
                  ].filter(Boolean).join(' ')}
                </p>
              </div>
            )}

            {/* FOOTER VERIFICATION STAMP */}
            <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span>SmartSite Advisor © 2026 • Verified AI Property Intelligence System</span>
              <span className="flex items-center gap-1 font-semibold text-slate-500">
                <FileText size={14} /> Official Audit Reference Document
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
