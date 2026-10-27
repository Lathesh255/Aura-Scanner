'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, Zap, Terminal, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto pb-32">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neon mb-8">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-gray-300">SYSTEM ONLINE v2.0.4</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
              DECODE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b026ff] to-[#00f0ff] animate-pulse">
                DIGITAL AURA
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-mono">
              Advanced AI vibe analysis. Detect emotions, personality traits, and raw energy levels from your selfies, voice, and text.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/scan">
                <button className="px-8 py-4 rounded-xl font-bold bg-[#b026ff] text-white hover:bg-[#9015db] transition-all shadow-[0_0_30px_rgba(176,38,255,0.4)] hover:shadow-[0_0_50px_rgba(176,38,255,0.6)] flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5" /> Initiate VibeScan
                </button>
              </Link>
              <Link href="/rizz">
                <button className="px-8 py-4 rounded-xl font-bold glass-panel text-white hover:bg-white/10 transition-all flex items-center gap-2 text-lg">
                  <Terminal className="w-5 h-5 text-[#00f0ff]" /> AI Roast / Rizz
                </button>
              </Link>
            </div>
          </div>

          {/* Floating elements behind hero */}
          <div className="absolute right-[10%] top-[20%] w-32 h-32 glass-panel rounded-2xl border border-[#00f0ff]/30 opacity-50 hidden lg:flex items-center justify-center">
            <Activity className="w-12 h-12 text-[#00f0ff]" />
          </div>

          <div className="absolute left-[10%] bottom-[30%] w-24 h-24 glass-panel rounded-full border border-[#b026ff]/30 opacity-50 hidden lg:flex items-center justify-center">
            <Camera className="w-8 h-8 text-[#b026ff]" />
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">CORE MODULES</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#b026ff] to-[#00f0ff] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-2xl group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-[#b026ff]/20 flex items-center justify-center mb-6 group-hover:bg-[#b026ff]/40 transition-colors">
                <Camera className="w-7 h-7 text-[#b026ff]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Face & Selfie Analyzer</h3>
              <p className="text-gray-400 text-sm mb-6 font-mono">
                Upload a selfie to detect mood, energy, and generate an aura percentage.
              </p>
              <div className="flex items-center text-[#b026ff] text-sm font-bold group-hover:gap-2 transition-all">
                Launch Module <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-2xl group cursor-pointer border border-[#00f0ff]/20">
              <div className="w-14 h-14 rounded-xl bg-[#00f0ff]/20 flex items-center justify-center mb-6 group-hover:bg-[#00f0ff]/40 transition-colors">
                <Mic className="w-7 h-7 text-[#00f0ff]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Voice Energy Scanner</h3>
              <p className="text-gray-400 text-sm mb-6 font-mono">
                Record voice notes to analyze emotional tone and get a live energy graph.
              </p>
              <div className="flex items-center text-[#00f0ff] text-sm font-bold group-hover:gap-2 transition-all">
                Launch Module <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-2xl group cursor-pointer border border-[#ff2a85]/20">
              <div className="w-14 h-14 rounded-xl bg-[#ff2a85]/20 flex items-center justify-center mb-6 group-hover:bg-[#ff2a85]/40 transition-colors">
                <Terminal className="w-7 h-7 text-[#ff2a85]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Roast / Rizz Modes</h3>
              <p className="text-gray-400 text-sm mb-6 font-mono">
                Get roasted by AI, generate rizz lines, or receive Gen Z meme-style compliments.
              </p>
              <div className="flex items-center text-[#ff2a85] text-sm font-bold group-hover:gap-2 transition-all">
                Launch Module <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-32">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neon mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-gray-300">SYSTEM ONLINE v2.0.4</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
            DECODE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b026ff] to-[#00f0ff] animate-pulse">
              DIGITAL AURA
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-mono">
            Advanced AI vibe analysis. Detect emotions, personality traits, and raw energy levels from your selfies, voice, and text.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scan">
              <button className="px-8 py-4 rounded-xl font-bold bg-[#b026ff] text-white hover:bg-[#9015db] transition-all shadow-[0_0_30px_rgba(176,38,255,0.4)] hover:shadow-[0_0_50px_rgba(176,38,255,0.6)] flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5" /> Initiate VibeScan
              </button>
            </Link>
            <Link href="/rizz">
              <button className="px-8 py-4 rounded-xl font-bold glass-panel text-white hover:bg-white/10 transition-all flex items-center gap-2 text-lg">
                <Terminal className="w-5 h-5 text-[#00f0ff]" /> AI Roast / Rizz
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Floating elements behind hero */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] w-32 h-32 glass-panel rounded-2xl border border-[#00f0ff]/30 opacity-50 hidden lg:flex items-center justify-center"
        >
          <Activity className="w-12 h-12 text-[#00f0ff]" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-[10%] bottom-[30%] w-24 h-24 glass-panel rounded-full border border-[#b026ff]/30 opacity-50 hidden lg:flex items-center justify-center"
        >
          <Camera className="w-8 h-8 text-[#b026ff]" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">CORE MODULES</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#b026ff] to-[#00f0ff] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 rounded-2xl group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-[#b026ff]/20 flex items-center justify-center mb-6 group-hover:bg-[#b026ff]/40 transition-colors">
              <Camera className="w-7 h-7 text-[#b026ff]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Face & Selfie Analyzer</h3>
            <p className="text-gray-400 text-sm mb-6 font-mono">
              Upload a selfie to detect mood, energy, and generate an aura percentage.
            </p>
            <div className="flex items-center text-[#b026ff] text-sm font-bold group-hover:gap-2 transition-all">
              Launch Module <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 rounded-2xl group cursor-pointer border border-[#00f0ff]/20">
            <div className="w-14 h-14 rounded-xl bg-[#00f0ff]/20 flex items-center justify-center mb-6 group-hover:bg-[#00f0ff]/40 transition-colors">
              <Mic className="w-7 h-7 text-[#00f0ff]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Voice Energy Scanner</h3>
            <p className="text-gray-400 text-sm mb-6 font-mono">
              Record voice notes to analyze emotional tone and get a live energy graph.
            </p>
            <div className="flex items-center text-[#00f0ff] text-sm font-bold group-hover:gap-2 transition-all">
              Launch Module <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 rounded-2xl group cursor-pointer border border-[#ff2a85]/20">
            <div className="w-14 h-14 rounded-xl bg-[#ff2a85]/20 flex items-center justify-center mb-6 group-hover:bg-[#ff2a85]/40 transition-colors">
              <Terminal className="w-7 h-7 text-[#ff2a85]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">AI Roast / Rizz Modes</h3>
            <p className="text-gray-400 text-sm mb-6 font-mono">
              Get roasted by AI, generate rizz lines, or receive Gen Z meme-style compliments.
            </p>
            <div className="flex items-center text-[#ff2a85] text-sm font-bold group-hover:gap-2 transition-all">
              Launch Module <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
