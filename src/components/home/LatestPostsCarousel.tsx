"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/siteConfig";
import { useBackground } from "@/components/providers/BackgroundProvider";

interface Post {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  date?: string;
  tags?: string[];
}

export default function LatestPostsCarousel({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0);
  const { bgIndex } = useBackground();
  const images = siteConfig.bgImages || [];
  const dynamicCover = images.length > 0 ? images[bgIndex % images.length] : "/images/bg/bg0.jpg";
  const containerRef = useRef<HTMLDivElement>(null);

  // 触摸滑动
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent(prev => (prev + 1) % posts.length);
      else setCurrent(prev => (prev - 1 + posts.length) % posts.length);
    }
  };

  // 鼠标拖拽
  const mouseStartX = useRef(0);
  const handleMouseDown = (e: React.MouseEvent) => { mouseStartX.current = e.clientX; };
  const handleMouseUp = (e: React.MouseEvent) => {
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent(prev => (prev + 1) % posts.length);
      else setCurrent(prev => (prev - 1 + posts.length) % posts.length);
    }
  };

  // 自动轮播（有交互时暂停）
  const [autoPlaying, setAutoPlaying] = useState(true);
  useEffect(() => {
    if (posts.length <= 1 || !autoPlaying) return;
    const id = setInterval(() => setCurrent(prev => (prev + 1) % posts.length), 5000);
    return () => clearInterval(id);
  }, [posts.length, autoPlaying]);

  if (!posts.length) return null;
  const post = posts[current];

  return (
    <div
      ref={containerRef}
      className="rounded-3xl glass-card overflow-hidden relative group min-h-[320px] h-full flex flex-col cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Link href={`/posts/${post.slug}/`} className="absolute inset-0 z-20" aria-label={post.title} />

      <AnimatePresence mode="wait">
        <motion.div key={post.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0">
          <img
            src={post.cover || dynamicCover}
            className="w-full h-full object-cover opacity-90 transition-all duration-[2000ms] ease-in-out group-hover:scale-105"
            alt={post.title}
            style={{ viewTransitionName: `article-cover-${post.slug}` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-end p-6 h-full pointer-events-none">
        {post.tags && <div className="flex gap-2 mb-2">
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-indigo-500/80 backdrop-blur-lg rounded-full text-[10px] text-white font-bold uppercase tracking-widest">{tag}</span>
          ))}
        </div>}
        <h2 className="text-xl font-bold text-white mb-2 drop-shadow-md">{post.title}</h2>
        {post.excerpt && <p className="text-sm text-gray-300 line-clamp-2">{post.excerpt}</p>}
      </div>

      {posts.length > 1 && (
        <div className="absolute bottom-4 right-6 z-30 flex gap-2">
          {posts.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setAutoPlaying(false); setCurrent(i); }}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-6 bg-indigo-400" : "w-2 bg-white/40 hover:bg-white/80"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
