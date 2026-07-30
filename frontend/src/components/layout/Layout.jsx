import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Search, Sparkles, User, LogOut, Menu, X, LayoutDashboard, 
  Building2, PlusCircle, Scale, ShieldCheck, ChevronRight, Zap, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* ── Main Fixed Header Navbar anchored flush to top-0 ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl text-white'
          : 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800/60 text-white'
      }`}>
        {/* Integrated Top Micro Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-950 to-emerald-950 text-white text-[11px] py-1 px-4 text-center border-b border-white/5 flex items-center justify-center gap-2 font-medium">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-400/30">
            <Zap size={10} className="text-indigo-400" /> AI Ecosystem 2.5
          </span>
          <span className="hidden sm:inline text-slate-300">Multi-Agent Property Valuation & Lifestyle Match Engine</span>
          <Sparkles size={11} className="text-emerald-400 animate-pulse hidden sm:inline" />
        </div>

        <div className="container-app py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group no-underline">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <Building2 size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SmartSite <span className="text-indigo-400 font-semibold text-sm">Advisor</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1">
                <Award size={10} className="text-emerald-400" /> AI Property Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              to="/" 
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-1.5 ${
                isActive('/') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home size={16} /> Home
            </Link>

            {isAuthenticated && user?.role === 'buyer' && (
              <>
                <Link 
                  to="/buyer/search" 
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-1.5 ${
                    isActive('/buyer/search') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Search size={16} /> Properties
                </Link>
                <Link 
                  to="/buyer/dashboard" 
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-1.5 ${
                    isActive('/buyer/dashboard') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard size={16} /> Buyer Hub
                </Link>
                <Link 
                  to="/buyer/compare" 
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-1.5 ${
                    isActive('/buyer/compare') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Scale size={16} className="text-emerald-400" /> Plain-English Comparison
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'seller' && (
              <>
                <Link 
                  to="/seller/dashboard" 
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-1.5 ${
                    isActive('/seller/dashboard') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard size={16} /> Seller Analytics
                </Link>
                <Link 
                  to="/seller/properties/create" 
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-1.5 ${
                    isActive('/seller/properties/create') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <PlusCircle size={16} className="text-emerald-400" /> Add Property
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <Link 
                to="/properties" 
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all no-underline flex items-center gap-1.5 ${
                  isActive('/properties') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Search size={16} /> Browse Listings
              </Link>
            )}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200">{user?.name}</span>
                    <span className="text-[10px] text-indigo-300 font-medium capitalize flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${user?.role === 'seller' ? 'bg-emerald-400' : 'bg-indigo-400'}`}></span>
                      {user?.role} Account
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1.5 !bg-slate-900 !text-slate-300 hover:!text-rose-400 hover:!bg-rose-500/10 hover:!border-rose-500/30"
                  title="Logout"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-xs no-underline !bg-slate-900 !text-slate-200 hover:!bg-slate-800 !border-slate-800">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-xs no-underline flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950 border-t border-slate-800 px-6 py-4"
            >
              <div className="flex flex-col gap-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-slate-200 no-underline font-medium">
                  <span>Home</span>
                  <ChevronRight size={16} className="text-slate-500" />
                </Link>

                {isAuthenticated && user?.role === 'buyer' && (
                  <>
                    <Link to="/buyer/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-slate-200 no-underline font-medium">
                      <span>Browse Properties</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </Link>
                    <Link to="/buyer/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-slate-200 no-underline font-medium">
                      <span>Buyer Dashboard</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </Link>
                    <Link to="/buyer/compare" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-slate-200 no-underline font-medium">
                      <span>Property Comparison</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </Link>
                  </>
                )}

                {isAuthenticated && user?.role === 'seller' && (
                  <>
                    <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-slate-200 no-underline font-medium">
                      <span>Seller Dashboard</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </Link>
                    <Link to="/seller/properties/create" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-slate-200 no-underline font-medium">
                      <span>Add New Property</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </Link>
                  </>
                )}

                {!isAuthenticated && (
                  <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-slate-200 no-underline font-medium">
                    <span>Browse Properties</span>
                    <ChevronRight size={16} className="text-slate-500" />
                  </Link>
                )}

                <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn-secondary w-full text-rose-400 border-rose-500/30 bg-rose-500/10">
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full text-center no-underline">
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center no-underline">
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Area with clean top padding flush under navbar */}
      <main className="flex-grow pt-24 pb-16">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-12 pb-8">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/60">
            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                  <Building2 size={18} />
                </div>
                <span className="text-xl font-extrabold text-white">SmartSite Advisor</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Empowering property buyers and estate developers with multi-agent AI scoring across lifestyle match %, pricing valuation, connectivity, and environmental health AQI.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
              <Link to="/" className="text-xs text-slate-400 hover:text-indigo-400 no-underline">Home Overview</Link>
              <Link to="/buyer/search" className="text-xs text-slate-400 hover:text-indigo-400 no-underline">Property Search</Link>
              <Link to="/buyer/compare" className="text-xs text-slate-400 hover:text-indigo-400 no-underline">Plain-English Comparison</Link>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Account</h4>
              <Link to="/login" className="text-xs text-slate-400 hover:text-indigo-400 no-underline">Buyer Sign In</Link>
              <Link to="/register?role=seller" className="text-xs text-slate-400 hover:text-indigo-400 no-underline">Seller Portal</Link>
              <Link to="/register" className="text-xs text-slate-400 hover:text-indigo-400 no-underline">Create Account</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} SmartSite Advisor AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Plain-English AI Reasoning</span>
              <span>•</span>
              <span>Geospatial Location Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
