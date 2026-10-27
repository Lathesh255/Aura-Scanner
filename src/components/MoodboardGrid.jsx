'use client';

import { Trash2 } from 'lucide-react';

export default function MoodboardGrid({ images, onDelete }) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center glass-panel rounded-3xl mt-8">
        <div className="w-24 h-24 mb-6 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-300">Your moodboard is empty</h3>
        <p className="text-gray-500 mt-2">Upload some visual assets to see the AI magic.</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mt-8">
      {images.map((image, i) => (
        <div 
          key={image.id || i} 
          className="break-inside-avoid relative group rounded-2xl overflow-hidden glass-panel animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
        >
          {/* Image */}
          <div className="relative w-full overflow-hidden bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={image.url} 
              alt="Moodboard asset" 
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Tags overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-end">
              <div className="flex flex-wrap gap-2 flex-1">
                {image.tags?.map(tag => (
                  <span 
                    key={tag} 
                    className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-white/20 backdrop-blur-md text-white border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(image.id)}
                  className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-md transition-colors ml-2"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
