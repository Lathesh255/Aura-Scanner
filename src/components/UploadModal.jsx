'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [analyzedTags, setAnalyzedTags] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setAnalyzedTags(null);
    setFile(null);
    setImageUrl('');
    setPreview('');
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setImageUrl('');
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreview(e.target.value);
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file && !imageUrl) return;
    setIsUploading(true);

    try {
      let finalImageUrl = imageUrl;

      // 1. Upload to local storage via API if file is provided
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      // 2. Analyze image with OpenRouter
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: finalImageUrl }),
      });
      
      const { tags } = await analyzeRes.json();

      // 3. Save to Local Database
      const saveRes = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: finalImageUrl,
          tags: tags || ['Uncategorized'],
        }),
      });

      if (!saveRes.ok) throw new Error('Failed to save to database');
      const newImage = await saveRes.json();

      onUploadComplete(newImage);
      setAnalyzedTags(tags || ['Uncategorized']);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload and analyze image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {analyzedTags ? (
          <div className="space-y-6 py-4 text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-4 animate-bounce">✨</div>
            <h3 className="text-2xl font-bold text-white">Analysis Complete!</h3>
            
            <div className="my-6">
              <p className="text-gray-400 mb-2 uppercase tracking-widest text-xs font-semibold">Primary Mood Detected</p>
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                {analyzedTags[0]}
              </div>
            </div>

            {analyzedTags.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {analyzedTags.slice(1).map((tag, i) => (
                  <span key={i} className="px-3 py-1 glass text-sm font-medium text-gray-300 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleClose}
              className="mt-8 w-full relative overflow-hidden rounded-xl bg-white text-black font-bold py-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Close & View Moodboard
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Add to Moodboard
            </h2>

            <div className="space-y-6">
              {/* File Upload Area */}
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploading}
                />
                <div className={cn(
                  "glass border-2 border-dashed border-gray-600 rounded-xl p-8 text-center transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-indigo-500/10",
                  file && "border-indigo-500 bg-indigo-500/10"
                )}>
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                  <p className="text-sm text-gray-300 font-medium">
                    {file ? file.name : "Drag & drop an image or click to browse"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-700 flex-1"></div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">or</span>
                <div className="h-px bg-gray-700 flex-1"></div>
              </div>

              {/* URL Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={handleUrlChange}
                  disabled={isUploading}
                  className="glass-input block w-full pl-10 pr-3 py-3 border-gray-600 rounded-xl text-sm placeholder-gray-500 text-white focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden glass">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={(!file && !imageUrl) || isUploading}
                className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-px font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 rounded-[11px] flex items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Vibe...</span>
                    </>
                  ) : (
                    <span>Upload & Analyze</span>
                  )}
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
