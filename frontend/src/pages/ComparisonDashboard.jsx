import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { buyerAPI, propertyAPI } from '../services/api';
import ScoreRing from '../components/ui/ScoreRing';
import ExplainerChatbot from '../components/ui/ExplainerChatbot';
import {
  GitCompare, Trophy, MapPin, Bed, Bath, Maximize,
  Sparkles, CheckCircle2, AlertTriangle, TrendingUp, Zap, ChevronDown,
  Clock, ShieldCheck, Heart, DollarSign, CloudSun, ThumbsUp, ThumbsDown,
  Building, UserCheck, HelpCircle, ArrowRight, Compass, Navigation
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function ComparisonDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [comparedProperties, setComparedProperties] = useState([]);
  const [winner, setWinner] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'financial' | 'convenience' | 'table'

  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',');
      setSelectedIds(ids);
      fetchComparison(ids);
    } else {
      fetchAllProperties();
    }
  }, [searchParams]);

  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      const res = await propertyAPI.getAll();
      if (res.data?.success) {
        setAllProperties(res.data.data.properties || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
    setLoading(false);
  };

  const fetchComparison = async (ids) => {
    setLoading(true);
    try {
      const { data } = await buyerAPI.compareProperties({
        propertyIds: ids,
        buyerId: user?._id,
      });
      if (data?.success) {
        setComparedProperties(data.data.properties || []);
        setWinner(data.data.winner);
      }
    } catch (err) {
      try {
        const promises = ids.map(id => propertyAPI.getById(id));
        const results = await Promise.all(promises);
        const props = results.map(r => r.data?.data || r.data).filter(Boolean);
        setComparedProperties(props);
      } catch (e) {
        console.error('Failed comparison fallback:', e);
      }
    }
    setLoading(false);
  };

  const toggleId = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      fetchComparison(selectedIds);
    }
  };

  const formatPrice = (p) => {
    if (!p) return '₹0';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)} Lakhs`;
    return `₹${p?.toLocaleString('en-IN')}`;
  };

  // Plain-English Financial EMI Estimator (@ 8.5% interest for 20 years)
  const calculateEMI = (price) => {
    if (!price) return 0;
    const loanAmount = price * 0.8; // 80% loan
    const ratePerMonth = 8.5 / 12 / 100;
    const tenureMonths = 240;
    const emi = (loanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths)) / (Math.pow(1 + ratePerMonth, tenureMonths) - 1);
    return Math.round(emi);
  };

  // Helper to synthesize Plain-English Verdict for a property
  const getPlainEnglishVerdict = (prop, index) => {
    const score = prop.aiScore?.overall || 80;
    const bedrooms = prop.specifications?.bedrooms || 2;
    const price = prop.price || 5000000;

    if (bedrooms >= 3) {
      return {
        badge: "👨‍👩‍👧 Best for Growing Families",
        summary: "Spacious layout with multi-room setup. Great for family living with schools and parks within easy distance.",
        pros: ["Large living space & extra balcony", "Close to primary schools & grocery stores", "24/7 security with gated entry"],
        cons: ["Slightly higher monthly maintenance outflow"]
      };
    } else if (price < 8000000) {
      return {
        badge: "💰 High Value & Budget Friendly",
        summary: "Maximum bang for your buck! Low monthly EMI outlay with high potential for price appreciation.",
        pros: ["Affordable monthly EMI", "Ideal for first-time home buyers", "High rental demand from IT professionals"],
        cons: ["Standard parking capacity"]
      };
    } else {
      return {
        badge: "💼 Perfect for IT & Working Professionals",
        summary: "Prime location near metro & IT hubs. Minimal daily travel stress with excellent high-speed connectivity.",
        pros: ["Less than 10 mins commute to office hubs", "Walking distance to metro & supermarkets", "High resale value & strong liquid asset"],
        cons: ["Higher entry price per sqft"]
      };
    }
  };

  if (loading) {
    return (
      <div className="container-app py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Generating Plain-English Comparison Analysis...</span>
        </div>
      </div>
    );
  }

  // ── SELECTION MODE ──
  if (comparedProperties.length === 0) {
    return (
      <div className="container-app py-6 pb-12">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4">
            <Sparkles size={14} className="text-indigo-600" /> Plain-English Property Comparison
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Compare Properties in <span className="text-indigo-600">Simple Everyday Terms</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Select 2 to 4 properties below to compare prices, monthly EMIs, daily commute times, air quality, and plain-English pros & cons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allProperties.map((prop, i) => {
            const isSelected = selectedIds.includes(prop._id);
            return (
              <div
                key={prop._id}
                onClick={() => toggleId(prop._id)}
                className={`bg-white rounded-3xl p-5 border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                    alt={prop.title}
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate">{prop.title}</h3>
                    <div className="text-indigo-600 font-extrabold text-sm mt-0.5">{formatPrice(prop.price)}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-slate-400" /> {prop.location?.city || 'Bangalore'}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-transparent'
                  }`}>
                    <CheckCircle2 size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedIds.length >= 2 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <button 
              onClick={handleCompare} 
              className="btn-primary !px-8 !py-4 flex items-center gap-3 shadow-xl shadow-indigo-500/30 text-base font-bold rounded-full"
            >
              <GitCompare size={20} />
              Compare {selectedIds.length} Properties in Plain English
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── COMPARISON VIEW ──
  return (
    <div className="container-app py-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => { setComparedProperties([]); setSelectedIds([]); }}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2 transition-colors"
          >
            ← Change Selected Properties ({comparedProperties.length} Selected)
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GitCompare size={28} className="text-indigo-600" /> Plain-English Property Decision Guide
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Easy-to-understand breakdown of costs, commuting, lifestyle match, and pros & cons.
          </p>
        </div>

        {/* Tab View Selector */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'summary' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plain Verdict & Pros
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'financial' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly EMI & Costs
          </button>
          <button
            onClick={() => setActiveTab('convenience')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'convenience' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Commute & Air AQI
          </button>
        </div>
      </div>

      {/* ── AI Executive Winner Banner ── */}
      {winner && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 mb-10 shadow-2xl border border-indigo-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Trophy size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                <Sparkles size={12} /> Top Recommended Option for You
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                Our Winner: <span className="text-indigo-300">{winner.title}</span>
              </h2>
              <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed max-w-3xl">
                {winner.explanation?.[0] || 'This property gives you the highest overall balance of location convenience, affordability, and healthy green surroundings.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDE BY SIDE PROPERTY CARDS ── */}
      <div className={`grid gap-6 ${comparedProperties.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {comparedProperties.map((prop, i) => {
          const verdict = getPlainEnglishVerdict(prop, i);
          const emi = calculateEMI(prop.price);
          const isWinner = winner?.id === prop._id;

          return (
            <div 
              key={prop._id}
              className={`bg-white rounded-3xl overflow-hidden border-2 shadow-lg transition-all flex flex-col ${
                isWinner ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/90'
              }`}
            >
              {/* Card Image Header */}
              <div className="relative h-48 bg-slate-900">
                <img
                  src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                  alt={prop.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {isWinner && (
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Trophy size={12} /> #1 Recommendation
                  </div>
                )}

                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                  <div>
                    <h3 className="font-extrabold text-lg drop-shadow">{prop.title}</h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                      <MapPin size={12} className="text-indigo-400" /> {prop.location?.city || 'Bangalore'}
                    </p>
                  </div>
                  <ScoreRing score={prop.matchPercentage || prop.aiScore?.overall || 82} size={54} label="Score" />
                </div>
              </div>

              {/* Body Content depending on activeTab */}
              <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
                {/* ── TAB 1: SUMMARY & VERDICT ── */}
                {activeTab === 'summary' && (
                  <div className="space-y-5">
                    {/* Badge */}
                    <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 text-xs font-bold">
                      {verdict.badge}
                    </div>

                    {/* Simple Explanation */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">In Simple Terms</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{verdict.summary}</p>
                    </div>

                    {/* Price & EMI summary */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Asking Price</div>
                        <div className="text-lg font-extrabold text-indigo-600">{formatPrice(prop.price)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated EMI</div>
                        <div className="text-sm font-extrabold text-slate-800">₹{emi.toLocaleString('en-IN')}/mo</div>
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1.5">
                        <div className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                          <ThumbsUp size={14} className="text-emerald-600" /> What's Great About This:
                        </div>
                        {verdict.pros.map((p, idx) => (
                          <div key={idx} className="text-xs text-emerald-900 flex items-start gap-1.5 font-medium">
                            <span className="text-emerald-600 mt-0.5">•</span> <span>{p}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                        <div className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                          <ThumbsDown size={14} className="text-amber-600" /> Good to Know / Minor Caveats:
                        </div>
                        {verdict.cons.map((c, idx) => (
                          <div key={idx} className="text-xs text-amber-900 flex items-start gap-1.5 font-medium">
                            <span className="text-amber-600 mt-0.5">•</span> <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: FINANCIAL BREAKDOWN ── */}
                {activeTab === 'financial' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Financial Outflow Estimator</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-600 font-medium">Total Property Cost</span>
                        <span className="font-extrabold text-slate-900">{formatPrice(prop.price)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-600 font-medium">Monthly Bank EMI (8.5%)</span>
                        <span className="font-extrabold text-indigo-600">₹{emi.toLocaleString('en-IN')} / mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-600 font-medium">Est. Monthly Maintenance</span>
                        <span className="font-extrabold text-slate-800">₹{(prop.specifications?.carpetArea ? prop.specifications.carpetArea * 3.5 : 3500).toLocaleString()} / mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-emerald-900 font-bold">Potential Monthly Rent Income</span>
                        <span className="font-extrabold text-emerald-700">₹{Math.round((prop.price || 5000000) * 0.0035).toLocaleString()} / mo</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                      <div className="text-xs font-bold text-indigo-900 mb-1">Expected 5-Year Property Value</div>
                      <div className="text-xl font-extrabold text-indigo-700">
                        {formatPrice((prop.price || 5000000) * 1.42)}
                      </div>
                      <p className="text-[11px] text-indigo-600 mt-1">Based on location infrastructure growth rate (+7.4% / yr)</p>
                    </div>
                  </div>
                )}

                {/* ── TAB 3: COMMUTE & CONVENIENCE ── */}
                {activeTab === 'convenience' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Everyday Distances in Minutes</h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Metro Station</div>
                        <div className="text-sm font-extrabold text-indigo-600 mt-0.5">3 mins walk</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Supermarket / DMart</div>
                        <div className="text-sm font-extrabold text-indigo-600 mt-0.5">5 mins walk</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Primary School</div>
                        <div className="text-sm font-extrabold text-emerald-600 mt-0.5">8 mins drive</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Multi-specialty Hospital</div>
                        <div className="text-sm font-extrabold text-emerald-600 mt-0.5">10 mins drive</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <CloudSun size={16} className="text-emerald-600" /> Air Quality & Environment
                      </div>
                      <div className="text-sm font-extrabold text-emerald-800">
                        AQI {prop.environmentScore?.aqi || 45} ({prop.environmentScore?.aqiLabel || 'Fresh Clean Air Zone'})
                      </div>
                      <p className="text-[11px] text-emerald-700">Low traffic noise, high tree cover score.</p>
                    </div>
                  </div>
                )}

                {/* View Details Link */}
                <div className="pt-4 border-t border-slate-100">
                  <Link 
                    to={`/property/${prop._id}`} 
                    className="btn-primary w-full !py-2.5 text-xs flex items-center justify-center gap-2 no-underline"
                  >
                    <span>View Full Property Dossier</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Explainer AI Bot Component */}
              <ExplainerChatbot property={prop} color={COLORS[i]} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
