import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  Map, 
  ShieldCheck, 
  LineChart, 
  Brain, 
  Building2,
  Users,
  Award,
  Scale,
  CloudSun,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';

import SpotlightCard from '../components/reactbits/SpotlightCard';
import ShinyText from '../components/reactbits/ShinyText';
import CountUp from '../components/reactbits/CountUp';
import ParticlesBackground from '../components/reactbits/ParticlesBackground';
import TiltedCard from '../components/reactbits/TiltedCard';
import AILivePreview from '../components/reactbits/AILivePreview';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    },
  }),
};

export default function Home() {
  return (
    <div className="w-full relative overflow-hidden bg-slate-50">
      {/* Dynamic Floating Particles Canvas in Background */}
      <ParticlesBackground particleCount={60} particleColor="rgba(99, 102, 241, 0.25)" lineColor="rgba(99, 102, 241, 0.08)" />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* React Bits Glowing Badge */}
            <motion.div 
              custom={0} 
              initial="hidden" 
              animate="visible" 
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-indigo-200/80 shadow-sm backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                <ShinyText text="The Next-Gen Multi-Agent Real Estate AI" speed={4} />
              </span>
            </motion.div>

            {/* Main Headline with ShinyText */}
            <motion.h1 
              custom={1} 
              initial="hidden" 
              animate="visible" 
              variants={fadeUpVariants}
              className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8"
            >
              Make <ShinyText text="Intelligent" speed={3} className="font-extrabold" /> Real Estate Decisions.
              <br className="hidden md:block"/> Not Just Guesses.
            </motion.h1>

            <motion.p 
              custom={2} 
              initial="hidden" 
              animate="visible" 
              variants={fadeUpVariants}
              className="text-base md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              SmartSite uses multi-agent AI to score ROI, Amenities, Location Connectivity, and Air Quality AQI. 
              We match buyers to their dream home in plain English and help developers maximize project demand.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              custom={3} 
              initial="hidden" 
              animate="visible" 
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link 
                  to="/register?role=buyer" 
                  className="flex items-center justify-center gap-2.5 w-full px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all text-sm no-underline"
                >
                  <Sparkles size={18} /> Find My AI Property Match
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link 
                  to="/buyer/compare" 
                  className="flex items-center justify-center gap-2.5 w-full px-8 py-4 bg-white text-slate-900 border border-slate-300 rounded-full font-bold shadow-sm hover:shadow-md transition-all hover:bg-slate-50 text-sm no-underline"
                >
                  <Scale size={18} className="text-emerald-500" /> Plain-English Comparison
                </Link>
              </motion.div>
            </motion.div>

            {/* ── React Bits CountUp Live Metric Bar ── */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/90 shadow-glass"
            >
              <div className="text-center p-3">
                <div className="text-2xl md:text-3xl font-black text-indigo-600">
                  <CountUp to={98.4} decimals={1} suffix="%" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Valuation Accuracy</div>
              </div>

              <div className="text-center p-3 border-l border-slate-200">
                <div className="text-2xl md:text-3xl font-black text-emerald-600">
                  <CountUp to={1450} prefix="₹" suffix=" Cr+" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Properties Scored</div>
              </div>

              <div className="text-center p-3 border-l border-slate-200">
                <div className="text-2xl md:text-3xl font-black text-purple-600">
                  <CountUp to={12800} suffix="+" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Active Buyers</div>
              </div>

              <div className="text-center p-3 border-l border-slate-200">
                <div className="text-2xl md:text-3xl font-black text-amber-500">
                  <CountUp to={4.9} decimals={1} suffix=" / 5★" />
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Satisfaction Score</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── INTERACTIVE LIVE DEMO SECTION ── */}
      <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/30">
              <Zap size={14} className="text-indigo-400" /> Experience AI Multi-Agent Scoring
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Try the Live Property Matching Engine</h2>
            <p className="text-slate-400 text-sm mt-2">Adjust your lifestyle priorities below to see real-time score calculations.</p>
          </div>

          <AILivePreview />
        </div>
      </section>

      {/* ── REACT BITS SPOTLIGHT BENTO GRID SECTION ── */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
              <Award size={14} className="text-emerald-600" /> Platform Architecture
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">The Construction Intelligence Ecosystem</h2>
            <p className="text-slate-600 text-sm mt-2">Powered by Spotlight mouse-tracking containers and multi-agent algorithms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Spotlight 1: Large */}
            <SpotlightCard className="md:col-span-2" spotlightColor="rgba(99, 102, 241, 0.15)">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                <Brain size={26} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">AI Lifestyle Matchmaking for Buyers</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-lg mb-6 font-medium">
                Input your customized preference weights (e.g., 40% ROI, 30% Commute Time, 30% Amenities). 
                Our multi-agent algorithm grades every property against your priorities, giving you a 
                <span className="font-bold text-indigo-600"> Personalized Match %</span>.
              </p>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Personal Weights</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Daily Commute Meter</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Plain-English Explanations</span>
              </div>
            </SpotlightCard>

            {/* Bento Spotlight 2 */}
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.15)">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <TrendingUp size={26} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Seller & Constructor Analytics</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Constructors receive instant AI scores for their property listings alongside actionable to-do lists to increase ROI and market demand.
              </p>
            </SpotlightCard>

            {/* Bento Spotlight 3 */}
            <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.15)">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                <Map size={26} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Location & Air Quality AQI</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Automated analysis of neighborhood connectivity to schools, hospitals, and transit hubs via precise geospatial scoring and air quality metrics.
              </p>
            </SpotlightCard>

            {/* Bento Spotlight 4: Large Horizontal */}
            <SpotlightCard className="md:col-span-2" spotlightColor="rgba(168, 85, 247, 0.15)">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                    <ShieldCheck size={26} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Financial & Plain-English Transparency</h3>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-md font-medium">
                    No black-box algorithms. Every property comparison comes with estimated monthly EMIs, maintenance costs, and plain-English pros & cons.
                  </p>
                </div>
                
                <Link to="/buyer/compare" className="btn-primary !px-6 !py-3 text-xs flex items-center gap-2 flex-shrink-0 no-underline">
                  <span>Explore Comparison Engine</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </section>

      {/* ── REACT BITS 3D TILT SHOWCASE SECTION ── */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Designed for Seamless Decision Making</h2>
            <p className="text-slate-600 text-sm mt-2">Hover over cards below to see 3D perspective tilt effects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TiltedCard maxRotation={15}>
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 font-bold">01</div>
                  <h4 className="text-xl font-bold text-white mb-2">Smart Match Engine</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Personalized match scores calculated dynamically based on your budget, commute distance, and amenities preferences.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-bold text-indigo-400 flex items-center gap-1">
                  Learn More <ArrowRight size={12} />
                </div>
              </div>
            </TiltedCard>

            <TiltedCard maxRotation={15}>
              <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white p-8 rounded-3xl shadow-2xl border border-indigo-500/30 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 font-bold">02</div>
                  <h4 className="text-xl font-bold text-white mb-2">Plain-English Comparison</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Side-by-side comparison tables explaining monthly bank EMIs, air quality AQI, and pros & cons in simple terms.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-indigo-800/60 text-xs font-bold text-emerald-400 flex items-center gap-1">
                  Try Comparison <ArrowRight size={12} />
                </div>
              </div>
            </TiltedCard>

            <TiltedCard maxRotation={15}>
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 font-bold">03</div>
                  <h4 className="text-xl font-bold text-white mb-2">Developer Intelligence</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Constructors get instant property health scores and AI improvement recommendations to increase valuation.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-bold text-purple-400 flex items-center gap-1">
                  List Property <ArrowRight size={12} />
                </div>
              </div>
            </TiltedCard>
          </div>
        </div>
      </section>

      {/* ── FINAL RADIANT CTA SECTION ── */}
      <section className="py-20 bg-slate-950 text-white relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-6 border border-indigo-500/30">
            <Sparkles size={14} className="text-indigo-400" /> Start Your Property Journey Today
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Ready to find your <ShinyText text="Ideal Property Match?" speed={3} />
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Join thousands of smart home buyers and developers leveraging multi-agent real estate intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register?role=buyer" className="btn-primary !px-8 !py-4 text-sm flex items-center gap-2 no-underline shadow-xl shadow-indigo-500/30">
              <Sparkles size={18} /> Get Started as a Buyer
            </Link>
            <Link to="/register?role=seller" className="btn-secondary !px-8 !py-4 text-sm flex items-center gap-2 no-underline !bg-slate-900 !text-slate-200 border-slate-800">
              <Building2 size={18} className="text-emerald-400" /> Join as a Constructor / Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
