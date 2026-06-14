"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { siteConfig } from "@/siteConfig";
import { Sun, Moon, Menu } from "lucide-react";
import GlassOpacityControl from "@/components/layout/GlassOpacityControl";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/articles/", label: "文章" },
  { href: "/timeline/", label: "时光" },
  { href: "/photowall/", label: "照片" },
  { href: "/friends/", label: "友链" },
  { href: "/about/", label: "关于" },
  { href: "/stuff/", label: "杂物" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { switchBg } = useBackground();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // BiliPai 速度形变：跟踪鼠标/触摸速度
  const [velocity, setVelocity] = useState(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocityTimer = useRef<ReturnType<typeof setTimeout>>();

  const handlePointerMove = (e: React.PointerEvent) => {
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0 && dt < 100) {
      const vx = Math.abs(e.clientX - lastX.current) / dt * 1000; // px/s
      setVelocity(vx);
      if (velocityTimer.current) clearTimeout(velocityTimer.current);
      velocityTimer.current = setTimeout(() => setVelocity(0), 150);
    }
    lastX.current = e.clientX;
    lastTime.current = now;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = NAV_LINKS.findIndex(l => l.href === pathname);

  // BiliPai: deformationScaleXDelta=0.42, velocityRange=2200px/s
  const motionFraction = Math.min(velocity / 2200, 1);
  const scaleX = 1 + motionFraction * 0.42;
  const scaleY = 1 - motionFraction * 0.58 * 0.42; // compressionRatio

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "shadow-sm" : ""} glass-nav`}>
      <div className="w-[95%] max-w-6xl mx-auto h-16 flex items-center justify-between px-4">
        <Link href="/" className="text-xl font-black text-slate-800 dark:text-white tracking-tighter hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
          {siteConfig.navTitle || siteConfig.authorName}
        </Link>

        {/* 桌面端导航 —— BiliPai 液态玻璃胶囊指示器 */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-bold relative bg-white/10 dark:bg-slate-800/20 backdrop-blur-md rounded-full px-1.5 py-1 border border-white/20 dark:border-white/5"
          onPointerMove={handlePointerMove}
        >
          {/* 胶囊指示器 —— 速度形变 + 弹簧过渡 */}
          <div
            className="absolute top-1 h-[calc(100%-8px)] rounded-full z-0 pointer-events-none"
            style={{
              left: `calc(${activeIndex * 100}% / ${NAV_LINKS.length} + 6px)`,
              width: `calc(100% / ${NAV_LINKS.length} - 12px)`,
              transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
              transformOrigin: "center center",
              transition: "left 0.5s cubic-bezier(0.22, 1, 0.36, 1), width 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.1, 0.8, 0.15, 1.15)",
              // 6层液态玻璃绘制
              background: `
                radial-gradient(ellipse at 50% 35%, rgba(99,102,241,0.45) 0%, rgba(99,102,241,0.12) 50%, transparent 75%),
                linear-gradient(90deg, rgba(0,0,0,0.06) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.06) 100%),
                linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.04) 100%),
                rgba(99,102,241,0.18)
              `,
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: `
                0 2px 12px rgba(99,102,241,0.2),
                inset 0 1px 0 rgba(255,255,255,0.5),
                0 0 0 0.5px rgba(99,102,241,0.1)
              `,
            }}
          />
          {/* 暗色模式胶囊 */}
          <div
            className="absolute top-1 h-[calc(100%-8px)] rounded-full z-0 pointer-events-none dark:block hidden"
            style={{
              left: `calc(${activeIndex * 100}% / ${NAV_LINKS.length} + 6px)`,
              width: `calc(100% / ${NAV_LINKS.length} - 12px)`,
              transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
              transformOrigin: "center center",
              transition: "left 0.5s cubic-bezier(0.22, 1, 0.36, 1), width 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.1, 0.8, 0.15, 1.15)",
              background: `
                radial-gradient(ellipse at 50% 35%, rgba(129,140,248,0.5) 0%, rgba(129,140,248,0.15) 50%, transparent 75%),
                linear-gradient(90deg, rgba(0,0,0,0.12) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.12) 100%),
                linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.08) 100%),
                rgba(129,140,248,0.22)
              `,
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: `
                0 2px 16px rgba(129,140,248,0.3),
                inset 0 1px 0 rgba(255,255,255,0.2),
                0 0 0 0.5px rgba(129,140,248,0.15)
              `,
            }}
          />
          {NAV_LINKS.map((link, i) => {
            const isActive = i === activeIndex;
            return (
              <Link key={link.href} href={link.href}
                className={`relative z-10 px-3 py-1.5 rounded-full transition-colors duration-500 text-center flex-1 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={switchBg} className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/50 transition-colors text-sm" title="换背景">
            🖼
          </button>
          <GlassOpacityControl />
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/50 transition-colors">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(prev => !prev)}><Menu size={20} /></button>
        </div>
      </div>

      {/* 移动端导航 */}
      {mobileOpen && (
        <div className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 dark:border-white/5 px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`text-sm font-bold transition-colors py-2 ${
                pathname === link.href
                  ? "text-indigo-500"
                  : "text-slate-700 dark:text-slate-200 hover:text-indigo-500"
              }`}>{link.label}</Link>
          ))}
          <button onClick={() => { switchBg(); setMobileOpen(false); }}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-500 transition-colors py-2 text-left">🖼 换背景</button>
        </div>
      )}
    </header>
  );
}
