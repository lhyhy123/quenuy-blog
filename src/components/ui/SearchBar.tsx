"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Post {
  slug: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  date?: string;
}

export default function SearchBar({ posts = [] }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter(p =>
      (p.title || "").toLowerCase().includes(q) ||
      (p.excerpt || "").toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [query, posts]);

  // 回车跳转第一篇
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() && results.length > 0) {
      setIsOpen(false);
      router.push(`/posts/${results[0].slug}/`);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10 z-50" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-500 font-medium text-lg"
          placeholder="搜索文章... 回车跳转"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <svg className="absolute top-1/2 left-5 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map(post => (
              <div key={post.slug}
                onClick={() => { setIsOpen(false); router.push(`/posts/${post.slug}/`); }}
                className="block px-6 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{post.title}</h4>
                {post.excerpt && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{post.excerpt}</p>}
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-500 font-medium">未找到相关文章</div>
          )}
        </div>
      )}
    </div>
  );
}
