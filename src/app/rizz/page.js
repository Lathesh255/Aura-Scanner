'use client';

import { useState } from 'react';
import { Terminal, Send, Flame, Heart, Sparkles } from 'lucide-react';

export default function RizzPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('rizz'); // 'rizz', 'roast', 'compliment'
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/vibe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, mode })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data.message);
    } catch (err) {
      setResponse('SYSTEM ERROR: Could not compute your vibe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in-up">
      <div className="text-center mb-12">
        <Terminal className="w-16 h-16 mx-auto mb-6 text-[#ff2a85]" />
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#b026ff]">Response Generator</span>
        </h1>
        <p className="text-gray-400 font-mono text-lg">Enter context. Select mode. Let the AI cook.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border-neon">
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button 
            onClick={() => setMode('rizz')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mode === 'rizz' ? 'bg-[#ff2a85] text-white shadow-[0_0_20px_rgba(255,42,133,0.5)]' : 'glass bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <Heart className="w-5 h-5" /> Rizz Mode
          </button>
          <button 
            onClick={() => setMode('roast')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mode === 'roast' ? 'bg-[#ff5500] text-white shadow-[0_0_20px_rgba(255,85,0,0.5)]' : 'glass bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <Flame className="w-5 h-5" /> Roast Mode
          </button>
          <button 
            onClick={() => setMode('compliment')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mode === 'compliment' ? 'bg-[#00f0ff] text-[#050505] shadow-[0_0_20px_rgba(0,240,255,0.5)]' : 'glass bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <Sparkles className="w-5 h-5" /> Hype Mode
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something here (e.g., 'I just woke up at 2 PM', 'Help me reply to my crush', 'Rate my fit')..."
            className="w-full h-40 glass-input p-6 rounded-2xl text-lg resize-none"
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="px-6 py-3 rounded-xl bg-[#b026ff] text-white flex items-center justify-center gap-2 hover:bg-[#9015db] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(176,38,255,0.4)] cursor-pointer"
            >
              {loading ? <span className="animate-spin text-lg">⟳</span> : <><Send className="w-5 h-5" /> Send Context</>}
            </button>
          </div>
        </form>

        {response && (
          <div className="mt-8 p-6 rounded-2xl bg-[#b026ff]/10 border border-[#b026ff]/30 text-xl font-mono leading-relaxed shadow-[0_0_30px_rgba(176,38,255,0.15)] animate-scale-in">
            <span className="text-[#b026ff] mr-2">SYSTEM:</span> {response}
          </div>
        )}
      </div>
    </div>
  );
}
