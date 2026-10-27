'use client';

import { useState } from 'react';
import { Users, Swords, HeartHandshake } from 'lucide-react';

export default function ComparePage() {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!user1.trim() || !user2.trim()) return;

    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user1, user2 })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      alert('SYSTEM ERROR: Compatibility matrix failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 animate-fade-in-up">
      <div className="text-center mb-12">
        <Users className="w-16 h-16 mx-auto mb-6 text-[#00f0ff]" />
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
          VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#39ff14]">CLASH</span>
        </h1>
        <p className="text-gray-400 font-mono text-lg">Compare two aesthetics, personalities, or texts. See if they synergize or destroy each other.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border-neon">
        <form onSubmit={handleCompare} className="flex flex-col gap-8 items-center">
          <div className="flex flex-col md:flex-row gap-6 items-center w-full">
            <input 
              value={user1}
              onChange={(e) => setUser1(e.target.value)}
              placeholder="Subject 1 (e.g. 'Gym Bro', 'Finance Tech Bro')"
              className="flex-1 w-full glass-input p-4 rounded-xl text-center"
            />
            <div className="w-12 h-12 shrink-0 rounded-full bg-[#050505] flex items-center justify-center border border-white/10 font-bold text-[#00f0ff]">
              VS
            </div>
            <input 
              value={user2}
              onChange={(e) => setUser2(e.target.value)}
              placeholder="Subject 2 (e.g. 'Art Hoe', 'Goth Mommy')"
              className="flex-1 w-full glass-input p-4 rounded-xl text-center"
            />
          </div>

          <div className="text-center">
            <button 
              type="submit"
              disabled={loading || !user1.trim() || !user2.trim()}
              className="px-12 py-4 rounded-xl font-bold bg-[#00f0ff] text-[#050505] hover:bg-[#00c0cc] transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'CALCULATING SYNERGY...' : 'INITIATE CLASH'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-scale-in">
            <div className="glass p-6 rounded-2xl border border-[#39ff14]/30 text-center">
              <HeartHandshake className="w-8 h-8 mx-auto mb-4 text-[#39ff14]" />
              <p className="text-gray-400 text-sm font-mono mb-2">SYNERGY SCORE</p>
              <p className="text-5xl font-black text-[#39ff14] mb-4">{result.synergy}%</p>
              <p className="text-white font-mono text-sm">{result.verdict}</p>
            </div>

            <div className="glass p-6 rounded-2xl border border-[#ff2a85]/30 text-center">
              <Swords className="w-8 h-8 mx-auto mb-4 text-[#ff2a85]" />
              <p className="text-gray-400 text-sm font-mono mb-2">CHAOS METER</p>
              <p className="text-5xl font-black text-[#ff2a85] mb-4">{result.chaos}%</p>
              <p className="text-gray-300 text-sm">{result.analysis}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
