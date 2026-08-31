import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { buyerAPI, propertyAPI } from '../services/api';
import PropertyCard from '../components/cards/PropertyCard';
import PropertyMapView from '../components/property/PropertyMapView';
import PropertyReportModal from '../components/property/PropertyReportModal';
import { Brain, LayoutGrid, List, Filter, ArrowUpDown, Sparkles, Map, Leaf, Banknote, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sort: 'match', propertyType: '', bedrooms: '' });
  const [activeTag, setActiveTag] = useState('all');
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedReportProperty, setSelectedReportProperty] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const matchRes = await buyerAPI.getMatches({ buyerId: user?._id, ...filters });
      if (matchRes.data?.success) {
        setProperties(matchRes.data.data.properties || matchRes.data.data || []);
        setTotalResults(matchRes.data.data.total || 0);
      }
    } catch (err) {
      try {
        const fallback = await propertyAPI.getAll();
        if (fallback.data?.success) {
          setProperties(fallback.data.data.properties || fallback.data.data || []);
        }
      } catch (eTx) {
        console.error('Failed to load properties');
      }
    } finally {
      setLoading(false);
    }
  };

  // Client-side quick filter chip logic
  const filteredProperties = properties.filter(prop => {
    if (activeTag === 'clean_air') return (prop.environmentScore?.aqi || 50) <= 40;
    if (activeTag === 'under_1_5cr') return prop.price <= 15000000;
    if (activeTag === 'high_roi') return (prop.aiScore?.roiPotential || 8) >= 10 || (prop.aiScore?.overall || 0) >= 92;
    if (activeTag === 'mumbai') return prop.location?.city === 'Mumbai';
    if (activeTag === 'thane') return prop.location?.city === 'Thane';
    if (activeTag === 'navi_mumbai') return prop.location?.city === 'Navi Mumbai';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 md:px-12">
      {/* HEADER */}
      <motion.div initial="hidden" animate="visible" className="max-w-7xl mx-auto mb-10">
        <motion.div variants={fadeUp} custom={0} className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="px-4 py-2 rounded-full bg-ai-indigo/10 border border-ai-indigo/20 inline-flex items-center gap-2 mb-4">
              <Brain size={16} className="text-ai-indigo" />
              <span className="text-sm font-semibold text-ai-indigo">Analysis Complete</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              Welcome back, <span className="text-ai-indigo">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-600 font-medium">
              Your AI matches are ready — {filteredProperties.length} properties analyzed across MMR.
            </p>
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${viewMode === 'grid' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${viewMode === 'list' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <List size={16} /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${viewMode === 'map' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-600 hover:bg-indigo-50'}`}
            >
              <Map size={16} /> Map View
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* QUICK FILTER CHIPS BAR */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Filter size={14} /> Smart Tags:
          </span>

          <button
            onClick={() => setActiveTag('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTag === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Listings ({properties.length})
          </button>

          <button
            onClick={() => setActiveTag('clean_air')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTag === 'clean_air' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
          >
            <Leaf size={14} /> Clean Air (AQI &le; 40)
          </button>

          <button
            onClick={() => setActiveTag('under_1_5cr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTag === 'under_1_5cr' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
          >
            <Banknote size={14} /> Under &₹;1.5 Cr
          </button>

          <button
            onClick={() => setActiveTag('high_roi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTag === 'high_roi' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
          >
            <TrendingUp size={14} /> High ROI Target
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          <button
            onClick={() => setActiveTag('mumbai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTag === 'mumbai' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            Mumbai
          </button>
          <button
            onClick={() => setActiveTag('thane')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTag === 'thane' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            Thane
          </button>
          <button
            onClick={() => setActiveTag('navi_mumbai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTag === 'navi_mumbai' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            Navi Mumbai
          </button>
        </motion.div>

        {/* MAIN VIEW CONTENT: MAP OR GRID */}
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl h-[440px] border border-slate-100 shadow-soft animate-pulse overflow-hidden">
                  <div className="h-54 bg-slate-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-slate-200 rounded-md w-5/6" />
                    <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'map' ? (
            <PropertyMapView 
              properties={filteredProperties} 
              onOpenReport={(p) => setSelectedReportProperty(p)} 
              heightClass="h-[750px]"
            />
          ) : filteredProperties.length > 0 ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProperties.map((prop, i) => (
                <PropertyCard 
                  key={prop._id || i} 
                  property={prop} 
                  matchPercentage={prop.matchScore || prop.aiScore?.overall}
                  onOpenReport={(p) => setSelectedReportProperty(p)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-xl border border-dashed border-slate-200 rounded-3xl p-20 text-center shadow-soft">
              <Sparkles size={48} className="text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Properties Match Smart Tag</h3>
              <p className="text-slate-500 max-w-md mx-auto">Select 'All Listings' or run the Live Harvester to fetch fresh listings for this region.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI INVESTMENT & ENVIRONMENTAL REPORT MODAL */}
      {selectedReportProperty && (
        <PropertyReportModal 
          property={selectedReportProperty} 
          isOpen={!!selectedReportProperty} 
          onClose={() => setSelectedReportProperty(null)} 
        />
      )}
    </div>
  );
}
