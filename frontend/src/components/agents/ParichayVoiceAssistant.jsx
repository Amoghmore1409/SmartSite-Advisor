import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles, Bot, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { agentAPI } from '../../services/api';

export default function ParichayVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState(null);

  // Web Speech API Voice Recognition (if supported in browser)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser. Please type your query.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      submitQuery(transcript);
    };

    recognition.start();
  };

  const submitQuery = async (textToSubmit) => {
    const activeText = textToSubmit || query;
    if (!activeText.trim()) return;

    setLoading(true);
    try {
      const response = await agentAPI.profileBuyer({
        query: activeText
      });
      if (response.data?.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      console.error("Parichay Voice Assistant Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Agent Launch Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 flex items-center justify-center border border-indigo-400/40"
        >
          <Bot size={24} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </motion.button>
      </div>

      {/* Agent Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Parichay AI Voice Concierge</h4>
                  <p className="text-[10px] text-emerald-400 font-bold">Autonomous Preference Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Input form */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitQuery()}
                  placeholder="Ask Parichay... (e.g. 3BHK near Metro under 1 Cr)"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-2xl py-3 pl-4 pr-20 border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
                <div className="absolute right-2 top-1.5 flex items-center gap-1">
                  <button
                    onClick={handleVoiceInput}
                    type="button"
                    className={`p-1.5 rounded-xl text-slate-400 hover:text-white transition-all ${
                      isListening ? 'bg-red-500 text-white animate-bounce' : 'hover:bg-slate-800'
                    }`}
                  >
                    <Mic size={14} />
                  </button>
                  <button
                    onClick={() => submitQuery()}
                    type="button"
                    disabled={loading}
                    className="p-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                  >
                    {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400">{result.personaCategory}</span>
                  <span className="text-[10px] text-slate-400">Budget: {result.suggestedBudget}</span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">{result.plainEnglishSummary}</p>

                <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
                  <div className="bg-indigo-950/60 p-1.5 rounded text-indigo-300">ROI {result.roiWeight}%</div>
                  <div className="bg-emerald-950/60 p-1.5 rounded text-emerald-300">Transit {result.transitWeight}%</div>
                  <div className="bg-purple-950/60 p-1.5 rounded text-purple-300">Amenities {result.amenitiesWeight}%</div>
                  <div className="bg-amber-950/60 p-1.5 rounded text-amber-300">Eco {result.ecoHealthWeight}%</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
