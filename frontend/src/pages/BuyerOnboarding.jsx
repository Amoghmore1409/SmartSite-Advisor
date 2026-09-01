import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { buyerAPI } from '../services/api';
import { MapPin, DollarSign, Sparkles, ArrowRight, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WEIGHT_FIELDS = [
  { key: 'price', label: 'Price Fit', description: 'How well it fits your budget' },
  { key: 'location', label: 'Location Quality', description: 'Area popularity, safety, growth' },
  { key: 'amenities', label: 'Amenities', description: 'Gym, pool, security, etc.' },
  { key: 'connectivity', label: 'Connectivity', description: 'Transit, highway, business hub access' },
  { key: 'roiPotential', label: 'ROI Potential', description: 'Rental yield & appreciation outlook' },
];

const DEFAULT_WEIGHTS = { price: 0.35, location: 0.30, amenities: 0.20, connectivity: 0.10, roiPotential: 0.05 };

export default function BuyerOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    preferredPropertyTypes: ['Apartment'],
    listingPreference: 'Sale',
    budget: { min: 0, max: 15000000 },
    preferredLocations: ['Bangalore', 'Mumbai'],
    weights: DEFAULT_WEIGHTS,
  });

  // Pre-fill from existing preferences if this buyer already has some saved
  // (so revisiting this page to adjust settings doesn't silently reset them to defaults).
  useEffect(() => {
    if (!user?._id) {
      setLoadingExisting(false);
      return;
    }
    buyerAPI.getPreferences(user._id)
      .then((res) => {
        const existing = res.data?.data;
        if (existing) {
          setForm({
            preferredPropertyTypes: existing.preferredPropertyTypes?.length ? existing.preferredPropertyTypes : ['Apartment'],
            listingPreference: existing.listingPreference || 'Sale',
            budget: { min: existing.budget?.min || 0, max: existing.budget?.max || 15000000 },
            preferredLocations: existing.preferredLocations?.length ? existing.preferredLocations : [],
            weights: existing.weights || DEFAULT_WEIGHTS,
          });
        }
      })
      .catch(() => {
        // 404 (no preferences yet) is the expected case for a first-time buyer — keep defaults.
      })
      .finally(() => setLoadingExisting(false));
  }, [user?._id]);

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

  // Moving one priority slider proportionally redistributes the difference across
  // the other four, so the five weights always sum to 1.0 (required by the backend's
  // validateWeights) without the user having to do the arithmetic themselves.
  const handleWeightChange = (key, rawValue) => {
    const newValue = Math.max(0, Math.min(1, rawValue));
    setForm(prev => {
      const oldWeights = prev.weights;
      const delta = newValue - oldWeights[key];
      const otherKeys = WEIGHT_FIELDS.map(f => f.key).filter(k => k !== key);
      const othersSum = otherKeys.reduce((s, k) => s + oldWeights[k], 0);

      const updated = { ...oldWeights, [key]: newValue };
      if (othersSum > 1e-6) {
        otherKeys.forEach(k => {
          const share = oldWeights[k] / othersSum;
          updated[k] = Math.max(0, oldWeights[k] - delta * share);
        });
      }

      // Guard against floating-point drift so the sum stays exactly 1.0.
      const sum = WEIGHT_FIELDS.reduce((s, f) => s + updated[f.key], 0);
      if (sum > 1e-6) {
        WEIGHT_FIELDS.forEach(f => { updated[f.key] = updated[f.key] / sum; });
      }
      return { ...prev, weights: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // savePreferences (POST) upserts — required here since a first-time buyer has
      // no existing preferences doc yet, unlike updatePreferences (PATCH) which 404s
      // on nothing-to-update.
      await buyerAPI.savePreferences({ ...form, buyerId: user?._id });
      navigate('/buyer/dashboard');
    } catch (err) {
      console.error('Failed to save preferences', err);
      setError(err.response?.data?.message || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-200/80">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to SmartSite Advisor</h1>
          <p className="text-slate-500 text-sm mt-2">Configure your AI preferences to calculate personalized match percentages.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

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
                value={form.preferredLocations.join(', ')}
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

          {/* Scoring priority sliders — these directly become the weights the matching
              formula uses (calculateMatchForProperty), so buyers can steer which factors
              matter most to them instead of a fixed one-size-fits-all formula. */}
          <div>
            <label className="label-sm mb-3 text-slate-700 font-bold flex items-center gap-1.5">
              <SlidersHorizontal size={14} /> Scoring Priorities
            </label>
            <p className="text-xs text-slate-400 mb-4">
              Drag to set what matters most — the others adjust automatically so it always adds up to 100%.
            </p>
            <div className="space-y-4">
              {WEIGHT_FIELDS.map(({ key, label, description }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">{label}</span>
                    <span className="text-xs font-extrabold text-indigo-600">{Math.round(form.weights[key] * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(form.weights[key] * 100)}
                    onChange={(e) => handleWeightChange(key, Number(e.target.value) / 100)}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || loadingExisting}
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
