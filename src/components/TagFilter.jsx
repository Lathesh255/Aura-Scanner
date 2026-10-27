'use client';

import { cn } from '@/lib/utils';

export default function TagFilter({ tags, selectedTag, onSelectTag }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <span className="text-sm font-medium text-gray-400 mr-2">Filter by Vibe:</span>
      <button
        onClick={() => onSelectTag('All')}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          selectedTag === 'All'
            ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            : "glass text-gray-300 hover:bg-white/10"
        )}
      >
        All
      </button>
      
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            selectedTag === tag
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              : "glass text-gray-300 hover:bg-white/10"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
