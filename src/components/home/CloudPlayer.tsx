"use client";

import { useState, useRef } from "react";
import { useBackground } from "@/components/providers/BackgroundProvider";

const SONGS = [
  { file: "/music/起风了.mp3",      title: "起风了",       artist: "买辣椒也用券" },
  { file: "/music/悬溺.mp3",        title: "悬溺",         artist: "葛东琪" },
  { file: "/music/群青.mp3",        title: "群青",         artist: "YOASOBI" },
  { file: "/music/桃花诺.mp3",      title: "桃花诺",        artist: "G.E.M.邓紫棋" },
  { file: "/music/Counting Stars.mp3",  title: "Counting Stars",  artist: "OneRepublic" },
  { file: "/music/Hero.mp3",        title: "Hero",         artist: "Mili" },
  { file: "/music/Iron Lotus.mp3",  title: "Iron Lotus",   artist: "Mili" },
  { file: "/music/Victim.mp3",      title: "Victim",       artist: "Mili" },
  { file: "/music/UNDEAD.mp3",      title: "UNDEAD",       artist: "YOASOBI" },
  { file: "/music/海のまにまに.mp3", title: "海のまにまに",   artist: "YOASOBI" },
  { file: "/music/unravel.mp3",     title: "unravel",      artist: "TK from 凛として時雨" },
];

export default function CloudPlayer() {
  const { bgIndex, images } = useBackground();
  const cover = images[bgIndex % images.length] || "/images/bg/bg0.jpg";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const song = SONGS[idx];

  const play = (i: number) => {
    setIdx(i); setLoading(true);
    const a = audioRef.current || (() => { const aa = new Audio(); aa.volume = 0.7; audioRef.current = aa; return aa; })();
    if (!audioRef.current) audioRef.current = a;
    a.addEventListener("loadeddata", () => setLoading(false), { once: true });
    a.addEventListener("play", () => setPlaying(true));
    a.addEventListener("pause", () => setPlaying(false));
    a.addEventListener("ended", () => setIdx(j => (j + 1) % SONGS.length));
    a.addEventListener("timeupdate", () => a.duration && setProgress(a.currentTime / a.duration * 100));
    a.addEventListener("error", () => { setLoading(false); setIdx(j => (j + 1) % SONGS.length); });
    a.src = SONGS[i].file; a.load();
    a.play().catch(() => {});
  };

  const toggle = () => {
    if (!audioRef.current || !audioRef.current.src) { play(idx); return; }
    if (audioRef.current.paused) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  };

  // 加载中骨架屏（跟随全局 pulse 节奏）
  if (loading && !audioRef.current?.src) {
    return (
      <div className="h-full w-full rounded-3xl glass-card p-6 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full skeleton flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-24 rounded-md skeleton" />
            <div className="h-4 w-16 rounded-md skeleton" />
          </div>
        </div>
        <div className="mt-4"><div className="w-full h-1.5 rounded-full skeleton" /></div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="w-5 h-5 rounded-full skeleton" />
          <div className="w-10 h-10 rounded-full skeleton" />
          <div className="w-5 h-5 rounded-full skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-3xl glass-card p-6 flex flex-col justify-between transition-all duration-700">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-white/50 shadow-lg flex-shrink-0 overflow-hidden"
          style={{ animation: "spin 6s linear infinite", animationPlayState: playing ? "running" : "paused" }}>
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{song.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{song.artist}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full h-1.5 bg-white/30 dark:bg-slate-700/50 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <button onClick={() => play((idx - 1 + SONGS.length) % SONGS.length)}
          className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>
        <button onClick={toggle}
          className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : playing ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button onClick={() => play((idx + 1) % SONGS.length)}
          className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>
    </div>
  );
}
