import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { Activity, Zap, Users, Camera, Mic } from 'lucide-react';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "VibeChecker | AI Vibe Scanner",
  description: "Advanced AI vibe analysis platform. Detect emotions, personality, and aura using text, voice, and selfies.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} h-full antialiased dark`}
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          window.addEventListener('error', function(event) {
            fetch('/api/logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null
              })
            }).catch(() => {});
          });
          window.addEventListener('unhandledrejection', function(event) {
            fetch('/api/logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'unhandledrejection',
                message: event.reason ? event.reason.message || String(event.reason) : 'Unhandled promise rejection',
                stack: event.reason && event.reason.stack ? event.reason.stack : null
              })
            }).catch(() => {});
          });
        `}} />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f4f4f5] relative overflow-x-hidden">
        
        {/* Particle/Glow Backgrounds */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#b026ff]/10 blur-[150px] pointer-events-none z-[-1]" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00f0ff]/10 blur-[150px] pointer-events-none z-[-1]" />

        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-[#b026ff] flex items-center justify-center shadow-[0_0_15px_rgba(176,38,255,0.6)] group-hover:shadow-[0_0_25px_rgba(176,38,255,0.8)] transition-all">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-wider text-white">
                VIBE<span className="text-neon-purple">CHECKER</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/scan" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Camera className="w-4 h-4" /> VibeScan
              </Link>
              <Link href="/rizz" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" /> Rizz/Roast
              </Link>
              <Link href="/compare" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" /> Compatibility
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-md text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                Log In
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-bold bg-[#b026ff] text-white hover:bg-[#9015db] transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                Get Aura
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 pt-24 px-6 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
