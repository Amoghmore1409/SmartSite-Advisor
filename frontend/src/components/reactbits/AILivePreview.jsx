import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sliders, TrendingUp, CloudSun, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import ScoreRing from '../ui/ScoreRing';

export default function AILivePreview() {
  const [roiWeight, setRoiWeight] = useState(40);
  const [transitWeight, setTransitWeight] = useState(30);
  const [amenityWeight, setAmenityWeight] = useState(30);
  const [selectedProperty, setSelectedProperty] = useState('sobha');

  const properties = {
    sobha: {
      name: "Sobha Dream Acres",
      city: "Panathur, Bangalore",
      price: "₹95.0 Lakhs",
      baseRoi: 88,
      baseTransit: 82,
      baseAmenity: 94,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      verdict: "High yield rental option with 94/100 internal amenities rating."
    },
    brigade: {
      name: "Brigade Gateway Enclave",
      city: "Malleshwaram, Bangalore",
      price: "₹1.80 Cr",
      baseRoi: 92,
      baseTransit: 96,
      baseAmenity: 88,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      verdict: "Top-tier transit connectivity with direct access to metro and world trade center."
    },
    prestige: {
      name: "Prestige Lakeside Habitat",
      city: "Varthur, Bangalore",
      price: "₹1.20 Cr",
      baseRoi: 84,
      baseTransit: 78,
      baseAmenity: 96,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      verdict: "Best family community with pristine air quality score of AQI 42."
    }
  };

  const currentProp = properties[selectedProperty];

  // Calculate weighted score live
  const totalWeight = roiWeight + transitWeight + amenityWeight;
  const score = Math.round(
    ((currentProp.baseRoi * roiWeight) +
     (currentProp.baseTransit * transitWeight) +
     (currentProp.baseAmenity * amenityWeight)) / totalWeight
  );

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Interactive AI Lifestyle Calculator</h4>
            <p className="text-[11px] text-slate-400">Adjust parameters to see live score computation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(properties).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedProperty(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedProperty === key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {properties[key].name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Control Column */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-indigo-400 flex items-center gap-1"><TrendingUp size={14} /> Investment ROI Weight</span>
              <span className="text-slate-300">{roiWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={roiWeight}
              onChange={(e) => setRoiWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-emerald-400 flex items-center gap-1"><CloudSun size={14} /> Commute & Transit Weight</span>
              <span className="text-slate-300">{transitWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={transitWeight}
              onChange={(e) => setTransitWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-purple-400 flex items-center gap-1"><ShieldCheck size={14} /> Amenities & Comfort Weight</span>
              <span className="text-slate-300">{amenityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={amenityWeight}
              onChange={(e) => setAmenityWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProperty + score}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex items-center gap-5 shadow-xl"
            >
              <img
                src={currentProp.image}
                alt={currentProp.name}
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-extrabold text-indigo-400">{currentProp.price}</div>
                <h5 className="font-bold text-white text-base truncate">{currentProp.name}</h5>
                <p className="text-[11px] text-slate-400 truncate mb-2">{currentProp.city}</p>
                <p className="text-[11px] text-slate-300 leading-tight line-clamp-2">{currentProp.verdict}</p>
              </div>
              <div className="flex-shrink-0 text-center">
                <ScoreRing score={score} size={64} label="Match" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
