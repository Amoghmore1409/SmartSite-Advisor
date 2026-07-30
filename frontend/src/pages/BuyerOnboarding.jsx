import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buyerAPI } from '../services/api';
import { MapPin, DollarSign, Sparkles, Home, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BuyerOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    preferredPropertyTypes: ['Apartment'],
    listingPreference: 'Sale',
    budget: { min: 0, max: 15000000 },
    preferredLocations: ['Bangalore', 'Mumbai'],
    weights: { price: 0.35, location: 0.30, amenities: 0.20, connectivity: 0.10, roiPotential: 0.05 }
  });

  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial'];
  
  const togglePropertyType = (type) => {
    setForm(prev => ({
      ...prev,
      preferredPropertyTypes: prev.preferredPropertyTypes.includes(type)
        ? prev.preferredPropertyTypes.filter(t => t !== type)
        : [...prev.preferredPropertyTypes, type]
    }));
  };

  const handleLocationChange = (e) => {
    const locs = e.target.value.split(',').map(l => l.trim()).filter(Boolean);
    setForm(prev => ({ ...prev, preferredLocations: locs }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await buyerAPI.updatePreferences({ ...form, userId: user?._id });
      navigate('/buyer/dashboard');
    } catch (error) {
      console.error('Failed to save preferences', error);
      navigate('/buyer/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-200/80">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to SmartSite Advisor</h1>
          <p className="text-slate-500 text-sm mt-2">Configure your AI preferences to calculate personalized match percentages.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="label-sm block mb-3 text-slate-700 font-bold">Property Types</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {propertyTypes.map(type => (
                <button 
                  key={type} 
                  type="button" 
                  onClick={() => togglePropertyType(type)} 
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border ${
                    form.preferredPropertyTypes.includes(type) 
                      ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 shadow-sm' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  {form.preferredPropertyTypes.includes(type) && '✓ '} {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-sm block mb-2 text-slate-700 font-bold">Target Cities / Localities</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g., Whitefield, Indiranagar, Bandra (comma separated)" 
                defaultValue={form.preferredLocations.join(', ')}
                onChange={handleLocationChange} 
                className="input-field !pl-10" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-2 text-slate-700 font-bold">Maximum Budget (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number" 
                  min="0" 
                  value={form.budget.max} 
                  onChange={e => setForm(prev => ({...prev, budget: {...prev.budget, max: Number(e.target.value)}}))} 
                  className="input-field !pl-10" 
                />
              </div>
            </div>

            <div>
              <label className="label-sm block mb-2 text-slate-700 font-bold">Purchase Intent</label>
              <select 
                value={form.listingPreference} 
                onChange={e => setForm(prev => ({...prev, listingPreference: e.target.value}))} 
                className="input-field cursor-pointer"
              >
                <option value="Sale">Buy Property</option>
                <option value="Rent">Rent Property</option>
                <option value="Any">Any Opportunity</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full !py-3.5 text-sm flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Save & View AI Matches</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}