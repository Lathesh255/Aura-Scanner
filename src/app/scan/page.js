'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Activity, Zap, RefreshCw } from 'lucide-react';

export default function VibeScanPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);

  // Stop camera stream when leaving page or when stream changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Connect stream to video element when both are ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  }, [stream, isCameraActive]);

  // Client-side image compression to fit API payload limits
  const compressImage = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
      img.src = dataUrl;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result);
      setPreview(compressed);
    };
    reader.readAsDataURL(file);
    setResult(null); // Reset previous scan
  };

  const startCamera = async () => {
    setResult(null);
    setPreview(null);
    setImage(null);
    setIsCameraActive(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please check permissions or upload an image file instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror the context so selfie is orientation-correct
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg');
      const compressed = await compressImage(dataUrl);
      setPreview(compressed);
      stopCamera();
    }
  };

  const handleScan = async () => {
    if (!preview) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: preview })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 animate-fade-in-up">
      <div className="text-center mb-12">
        <Camera className="w-16 h-16 mx-auto mb-6 text-[#b026ff]" />
        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
          AURA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b026ff] to-[#00f0ff]">SCANNER</span>
        </h1>
        <p className="text-gray-400 font-mono text-lg">Snap a selfie or upload a fit. We decode the vibe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload/Webcam Card */}
        <div className="glass-panel p-8 rounded-3xl border-neon flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
          {/* Live camera stream */}
          {isCameraActive && (
            <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-4 bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover rounded-2xl transform -scale-x-100"
              />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
                <button 
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-[#b026ff] text-white rounded-xl font-bold hover:bg-[#9015db] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(176,38,255,0.4)] cursor-pointer"
                >
                  <Camera className="w-5 h-5" /> CAPTURE PHOTO
                </button>
                <button 
                  onClick={stopCamera}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {/* Photo preview */}
          {preview && !isCameraActive && (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
          )}

          {/* Default upload or camera activation prompt */}
          {!preview && !isCameraActive && (
            <div className="relative z-10 text-center flex flex-col items-center gap-6 w-full">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden"
                id="aura-upload"
              />
              <label htmlFor="aura-upload" className="cursor-pointer flex flex-col items-center group/label">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-4 border border-white/20 group-hover/label:bg-[#b026ff]/20 group-hover/label:border-[#b026ff] transition-all">
                  <Upload className="w-8 h-8 text-white group-hover/label:text-[#b026ff] transition-colors" />
                </div>
                <span className="text-lg font-bold text-white mb-2">Initialize Image Uplink</span>
                <span className="text-sm text-gray-400 font-mono">JPG, PNG up to 5MB</span>
              </label>

              <div className="flex items-center gap-3 w-full max-w-[200px] my-2">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-xs text-gray-500 font-mono">OR</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <button
                onClick={startCamera}
                className="px-6 py-3 rounded-xl font-bold bg-[#00f0ff] text-[#050505] hover:bg-[#00c0cc] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
              >
                <Camera className="w-5 h-5" /> USE WEBCAM
              </button>
            </div>
          )}

          {/* Captured photo controls */}
          {preview && !isCameraActive && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
              <button 
                onClick={() => {
                  setPreview(null);
                  setImage(null);
                  setResult(null);
                }}
                className="px-5 py-2.5 bg-black/60 backdrop-blur border border-white/10 hover:bg-black/80 text-white rounded-xl font-bold transition-all text-xs cursor-pointer"
              >
                CLEAR
              </button>
              <button 
                onClick={startCamera}
                className="px-5 py-2.5 bg-[#00f0ff] text-[#050505] hover:bg-[#00c0cc] rounded-xl font-bold transition-all text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.2)] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> RETAKE
              </button>
            </div>
          )}
        </div>

        {/* Action / Results Section */}
        <div className="flex flex-col gap-6">
          <button 
            onClick={handleScan}
            disabled={!preview || loading}
            className="w-full py-6 rounded-3xl font-black text-2xl uppercase tracking-widest bg-gradient-to-r from-[#b026ff] to-[#00f0ff] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(176,38,255,0.4)] cursor-pointer"
          >
            {loading ? (
              <span className="animate-spin"><Activity className="w-8 h-8" /></span>
            ) : (
              <><Zap className="w-8 h-8" /> SCAN AURA</>
            )}
          </button>

          {/* Result Display */}
          {result && (
            <div className="glass-panel flex-1 p-8 rounded-3xl border border-[#00f0ff]/30 relative overflow-hidden animate-scale-in">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/10 blur-[50px] rounded-full" />
              
              <h3 className="text-[#00f0ff] font-mono text-sm tracking-widest mb-6 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4" /> Scan Complete
              </h3>
              
              <div className="mb-8">
                <p className="text-gray-400 text-sm font-mono mb-2">DETECTED VIBE</p>
                <p className="text-4xl font-black text-white">{result.vibe}</p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-gray-400 text-sm font-mono">AURA LEVEL</p>
                  <p className="text-2xl font-black text-[#b026ff]">{result.auraScore}%</p>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${result.auraScore}%` }}
                    className="h-full bg-gradient-to-r from-[#b026ff] to-[#00f0ff] transition-all duration-1000 ease-out"
                  />
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-mono mb-2">SYSTEM ANALYSIS</p>
                <p className="text-gray-300 leading-relaxed text-sm">{result.analysis}</p>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="glass-panel flex-1 p-8 rounded-3xl flex items-center justify-center border-dashed border-2 border-white/10">
              <p className="text-gray-500 font-mono text-center">Awaiting visual input data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

