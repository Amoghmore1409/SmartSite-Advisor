import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertyAPI } from '../services/api';
import ScoreRing from '../components/ui/ScoreRing';
import ExplainerChatbot from '../components/ui/ExplainerChatbot';
import NegotiationAdvisorModal from '../components/agents/NegotiationAdvisorModal';
import PropertyMapView from '../components/property/PropertyMapView';
import PropertyReportModal from '../components/property/PropertyReportModal';
import { 
  Building2, MapPin, Bed, Bath, Maximize, ArrowLeft, Heart, 
  Share2, Sparkles, CloudSun, ShieldCheck, Phone, Mail, CheckCircle2,
  TrendingUp, Compass, Calendar, DollarSign, Handshake, FileText
} from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activePois, setActivePois] = useState([]);
  const [poiCategory, setPoiCategory] = useState(null);

  useEffect(() => {
    if (id) fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const res = await propertyAPI.getById(id);
      if (res.data?.success) {
        setProperty(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load property details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (isSaved || !property?._id) return;
    try {
      await propertyAPI.saveProperty(property._id);
      setIsSaved(true);
    } catch (e) {
      console.error('Failed to save property:', e);
    }
  };

  const formatPrice = (p) => {
    if (!p) return 'Price on Request';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
    return `₹${p.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="container-app py-12 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading Property Intelligence...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-app py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Building2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested property is no longer available or was removed.</p>
        <button onClick={() => navigate(-1)} className="btn-primary !px-6 !py-2.5">
          Go Back
        </button>
      </div>
    );
  }

  const { title, price, location, specifications, amenities, images, propertyType, aiScore, environmentScore, seller } = property;
  const match = aiScore?.overall || 85;

  return (
    <div className="container-app py-6 pb-16">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Listings
      </button>

      {/* Top Title & Actions Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-ai">{propertyType || 'Apartment'}</span>
            {environmentScore?.overall && (
              <span className="badge-success">
                <CloudSun size={12} /> AQI {environmentScore.aqi ?? 'N/A'} ({environmentScore.aqiLabel || 'Good'})
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">{title}</h1>
          <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
            <MapPin size={14} className="text-indigo-500" />
            {location?.address || location?.city || 'Location Details'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-left md:text-right mr-4">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Property Price</div>
            <div className="text-3xl font-extrabold text-indigo-600">{formatPrice(price)}</div>
          </div>
          <button 
            onClick={handleSave}
            className={`p-3 rounded-2xl border transition-all ${
              isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart size={20} className={isSaved ? "fill-rose-600" : ""} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery & Specifications */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Image */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200/80">
            <img 
              src={images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <ScoreRing score={match} size={64} label="Match" />
                <div>
                  <div className="text-lg font-extrabold">AI Compatibility Score</div>
                  <div className="text-xs text-slate-300">Scored using lifestyle factors & location connectivity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Bar */}
          <div className="glass-card p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <Bed size={20} className="text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-extrabold text-slate-900">{specifications?.bedrooms || 0} BHK</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Bedrooms</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <Bath size={20} className="text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-extrabold text-slate-900">{specifications?.bathrooms || 0}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Bathrooms</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <Maximize size={20} className="text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-extrabold text-slate-900">{specifications?.carpetArea || 0} sqft</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Carpet Area</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <Compass size={20} className="text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-extrabold text-slate-900">{specifications?.facing || 'East'}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Facing</div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">About this Property</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description || 'This property offers modern living spaces, high-end finishing, and convenient connectivity to financial districts and tech hubs.'}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Property Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(amenities || ['Lift', 'Gym', 'Parking', 'Security', 'Clubhouse']).map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800">
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LARGE EXPONSIVE INTERACTIVE MAP SECTION */}
          <div className="glass-card p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin size={22} className="text-indigo-600" /> Interactive Spatial & Neighborhood Map
                </h3>
                <p className="text-xs text-slate-500 font-medium">Explore surrounding infrastructure, transit connectivity, and regional neighborhood data.</p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100">
                GPS Verified
              </span>
            </div>

            <PropertyMapView 
              properties={[property]} 
              customPois={activePois}
              activePoiCategory={poiCategory}
              heightClass="h-[480px]" 
            />
          </div>
        </div>

        {/* Right Column: AI Assistant & Contact Seller */}
        <div className="lg:col-span-4 space-y-6">
          {/* Seller Card */}
          <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center font-bold text-lg text-white">
                {seller?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{seller?.name || 'Verified Developer'}</h4>
                <p className="text-xs text-indigo-300">Property Listing Agent</p>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-indigo-800/60 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Mail size={14} className="text-indigo-400" /> {seller?.email || 'contact@smartsite.com'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Phone size={14} className="text-emerald-400" /> {seller?.phone || '+91 98765 43210'}
              </div>
            </div>

            <button 
              onClick={() => alert(`Inquiry sent to ${seller?.name || 'Seller'}! They will reach out shortly.`)}
              className="btn-emerald w-full !py-3 text-xs flex items-center justify-center gap-2 mb-2"
            >
              <Phone size={14} /> Request Callback
            </button>

            <button
              onClick={() => setIsNegotiationOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 mb-2"
            >
              <Handshake size={16} /> Get AI Negotiation Strategy
            </button>

            <button
              onClick={() => setIsReportOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <FileText size={16} /> Download AI Audit Report
            </button>
          </div>

          {/* AI Reasoning Widget */}
          <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" /> AI Valuation Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Estimated ROI</span>
                <span className="font-bold text-emerald-600">+{aiScore?.roiPotential || 8.5}% / yr</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Transit Connectivity</span>
                <span className="font-bold text-slate-800">{aiScore?.connectivityScore || 85} / 100</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Environmental Health</span>
                <span className="font-bold text-slate-800">{environmentScore?.overall || 88} / 100</span>
              </div>
            </div>
          </div>

          {/* Explainer AI Bot */}
          <ExplainerChatbot 
            property={property} 
            color="#6366f1" 
            onPoiUpdate={(pois, category) => {
              setActivePois(pois);
              setPoiCategory(category);
            }}
          />
        </div>
      </div>

      {/* Negotiation Deal Advisor Modal */}
      <NegotiationAdvisorModal
        isOpen={isNegotiationOpen}
        onClose={() => setIsNegotiationOpen(false)}
        property={property}
      />

      {/* AI Investment Report Modal */}
      <PropertyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        property={property}
      />
    </div>
  );
}
