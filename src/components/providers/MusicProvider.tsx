"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { usePathname } from "next/navigation";

const S = [
  { f: "/music/起风了.mp3",      n: "起风了",       a: "买辣椒也用券" },
  { f: "/music/悬溺.mp3",        n: "悬溺",         a: "葛东琪" },
  { f: "/music/群青.mp3",        n: "群青",         a: "YOASOBI" },
  { f: "/music/桃花诺.mp3",      n: "桃花诺",        a: "G.E.M.邓紫棋" },
  { f: "/music/Counting Stars.mp3",  n: "Counting Stars",  a: "OneRepublic" },
  { f: "/music/Hero.mp3",        n: "Hero",         a: "Mili" },
  { f: "/music/Iron Lotus.mp3",  n: "Iron Lotus",   a: "Mili" },
  { f: "/music/Victim.mp3",      n: "Victim",       a: "Mili" },
  { f: "/music/UNDEAD.mp3",      n: "UNDEAD",       a: "YOASOBI" },
  { f: "/music/海のまにまに.mp3", n: "海のまにまに",   a: "YOASOBI" },
  { f: "/music/unravel.mp3",     n: "unravel",      a: "TK from 凛として時雨" },
];

const AP_CSS = `
.aplayer{background:rgba(255,255,255,.7)!important;backdrop-filter:blur(20px)!important;min-width:auto!important;width:auto!important;max-width:240px!important;border:1px solid rgba(255,255,255,.4)!important}
.aplayer .aplayer-body{padding:4px!important;display:flex!important;align-items:center!important;gap:4px!important}
.aplayer .aplayer-pic{width:34px!important;height:34px!important;margin:0!important;border-radius:50%!important;flex-shrink:0}
.aplayer .aplayer-info{flex:1!important;min-width:0!important;margin-left:0!important;border:none!important}
.aplayer .aplayer-music{margin-bottom:0!important;height:auto!important}
.aplayer .aplayer-author,.aplayer .aplayer-time,.aplayer .aplayer-volume-wrap,.aplayer .aplayer-icon-menu,.aplayer .aplayer-list,.aplayer .aplayer-lrc{display:none!important}
.aplayer .aplayer-title{font-size:11px!important;max-width:100px!important}
.aplayer .aplayer-controller{margin-top:2px!important;height:auto!important}
.aplayer .aplayer-bar-wrap{margin:0!important}
.aplayer .aplayer-bar,.aplayer .aplayer-loaded,.aplayer .aplayer-played{height:2px!important}
.aplayer .aplayer-thumb{width:6px!important;height:6px!important;margin-top:-2px!important}
.aplayer .aplayer-icon{width:18px!important;height:18px!important}
`;

// 仅用于子页面：提供 APlayer 紧凑浮窗
export function MusicProvider({ children }: { children: ReactNode }) {
  const { bgIndex, images } = useBackground();
  const pathname = usePathname();
  const cover = images[bgIndex % images.length] || "/images/bg/bg0.jpg";
  const containerRef = useRef<HTMLDivElement>(null);
  const apRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    if (isHome) return;
    const go = () => {
      const A = (window as any).APlayer;
      if (!A || !containerRef.current || apRef.current) return;
      const ap = new A({ container: containerRef.current, mini: false, fixed: false, autoplay: false, mutex: true, preload: "metadata", theme: "#6366f1", volume: 0.7, audio: S.map(s => ({ name: s.n, artist: s.a, url: s.f, cover })) });
      ap.container.style.cssText = "position:fixed;bottom:72px;right:16px;z-index:9998;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.12);";
      if (!document.getElementById("ap-css")) { const st = document.createElement("style"); st.id = "ap-css"; st.textContent = AP_CSS; document.head.appendChild(st); }
      injectDrag(ap.container); apRef.current = ap; setReady(true);
    };
    if (!document.querySelector('link[href*="APlayer.min.css"]')) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css"; document.head.appendChild(l); }
    if ((window as any).APlayer) { go(); return; }
    const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js"; s.onload = go; document.head.appendChild(s);
    return () => {
      if (apRef.current) { try { apRef.current.destroy(); } catch {} apRef.current = null; }
      const st = document.getElementById("ap-css"); if (st) st.remove();
      setReady(false);
    };
  }, [isHome]);

  useEffect(() => {
    if (!apRef.current) return;
    try { apRef.current.list.audios.forEach((a: any) => a.cover = cover); const p = document.querySelector(".aplayer-pic") as HTMLElement; if (p) p.style.setProperty("background-image", `url(${cover})`, "important"); } catch {}
  }, [bgIndex]);

  return <>{children}{!isHome && <div ref={containerRef} />}</>;
}

function injectDrag(el: HTMLElement) {
  let on = false, sx = 0, sy = 0, ox = 0, oy = 0;
  const d = (e: Event) => { if ((e.target as HTMLElement)?.closest("button,a,.aplayer-pic,.aplayer-info,.aplayer-lrc,.aplayer-volume")) return; on = true; const c = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent); sx = c.clientX; sy = c.clientY; const r = el.getBoundingClientRect(); ox = r.left; oy = r.top; el.style.transition = "none"; };
  const m = (e: Event) => { if (!on) return; e.preventDefault(); const c = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent); el.style.left = Math.max(0, Math.min(innerWidth - el.offsetWidth, ox + c.clientX - sx)) + "px"; el.style.top = Math.max(0, Math.min(innerHeight - el.offsetHeight, oy + c.clientY - sy)) + "px"; el.style.right = el.style.bottom = "auto"; };
  const u = () => { on = false; el.style.transition = ""; };
  el.addEventListener("mousedown", d); el.addEventListener("touchstart", d, { passive: false });
  addEventListener("mousemove", m); addEventListener("touchmove", m, { passive: false });
  addEventListener("mouseup", u); addEventListener("touchend", u);
}
