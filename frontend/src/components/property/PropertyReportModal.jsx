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
  const notScored = 'Not yet scored';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        >
          {/* TOP ACTION BAR (Hidden in print) */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" />
              <span className="font-semibold text-sm">SmartSite Official AI Audit Dossier</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md"
              >
                <Printer size={16} /> Print / Save PDF Report
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* REPORT BODY (Printable Content) */}
          <div ref={printRef} className="p-8 md:p-12 space-y-8 bg-white text-slate-900 print:p-6 print:space-y-6">
            {/* HEADER BLOCK */}
            <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">
                  <Sparkles size={14} /> SmartSite Executive AI Audit • Report ID: #SSA-{property._id?.slice(-6).toUpperCase() || '2026-X'}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {property.title}
                </h1>
                <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                  <MapPin size={16} className="text-indigo-500" />
                  {property.location?.address || property.location?.city || property.locality}, {property.location?.city || 'MMR Region'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-right min-w-[200px]">
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">Target Valuation</span>
                <span className="text-2xl font-black text-slate-900 block">{formatPrice(property.price)}</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center justify-end gap-1 mt-1">
                  <TrendingUp size={12} /> {roi != null ? `ROI Score: ${roi}/100` : notScored}
                </span>
              </div>
            </div>

            {/* AI SCORECARD GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 p-4 rounded-2xl">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Overall SmartScore</span>
                <span className="text-3xl font-black text-indigo-900">{aiScore != null ? `${aiScore}/100` : '—'}</span>
                <span className="text-xs font-medium text-indigo-700 block mt-1">{aiScore != null ? 'AI-Scored' : notScored}</span>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 p-4 rounded-2xl">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Air Quality (AQI)</span>
                <span className="text-3xl font-black text-emerald-900">{aqi != null ? `${aqi} AQI` : '—'}</span>
                <span className="text-xs font-medium text-emerald-700 block mt-1">{aqi != null ? (property.environmentScore?.aqiLabel || 'Unknown') : notScored}</span>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100 p-4 rounded-2xl">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">ROI Potential Score</span>
                <span className="text-3xl font-black text-amber-900">{roi != null ? `${roi}/100` : '—'}</span>
                <span className="text-xs font-medium text-amber-700 block mt-1">{roi != null ? 'Composite ROI score' : notScored}</span>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 p-4 rounded-2xl">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">Data Verification</span>
                <span className="text-lg font-black text-purple-900 flex items-center gap-1 mt-1">
                  {property.verifiedLive ? (
                    <><CheckCircle2 size={18} className="text-emerald-500" /> Verified Live</>
                  ) : (
                    <span className="text-slate-500">Unverified / Sample Data</span>
                  )}
                </span>
                <span className="text-xs font-medium text-purple-700 block mt-1">{property.sourcePortal || 'Unknown source'}</span>
              </div>
            </div>

            {/* SECTION: FINANCIAL & ROI BREAKDOWN */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" /> Financial & Rental Yield Forecast
              </h3>

              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Rate per Sq.Ft</span>
                  <span className="font-bold text-slate-900 text-lg">
                    ₹{(property.pricePerSqFt || (property.price / (property.specifications?.carpetArea || 1000))).toFixed(0)} / sq.ft
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">ROI Potential Score</span>
                  <span className="font-bold text-slate-900 text-lg">
                    {roi != null ? `${roi} / 100` : notScored}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">Rental Yield Estimate</span>
                  <span className="font-bold text-emerald-600 text-lg">Not available</span>
                </div>
              </div>
            </div>

            {/* SECTION: ENVIRONMENTAL & HEALTH AUDIT */}
            <div className="border border-slate-200 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CloudSun size={18} className="text-emerald-600" /> Micro-Environmental & Health Scorecard
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Green Cover Index</span>
                  <span className="font-bold text-emerald-600 text-sm">{property.environmentScore?.greenCover != null ? `${property.environmentScore.greenCover}%` : notScored}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Ambient Noise Level</span>
                  <span className="font-bold text-indigo-600 text-sm">{property.environmentScore?.noiseLevel || notScored}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-slate-600">Environmental Rating</span>
                  <span className="font-bold text-emerald-600 text-sm">{envScore != null ? `${envScore}/100` : notScored}</span>
                </div>
              </div>
            </div>

            {/* AI SCORING SUMMARY */}
            {(aiScore != null || envScore != null || roi != null) && (
              <div className="p-6 bg-indigo-950 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <Award size={16} /> AI Scoring Summary
                  </span>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                  {[
                    aiScore != null && `Overall SmartScore is ${aiScore}/100.`,
                    aqi != null && `Air quality reads ${aqi} AQI (${property.environmentScore?.aqiLabel || 'Unknown'}).`,
                    roi != null && `ROI potential score is ${roi}/100.`,
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
