"use client";

import { useBackground } from "@/components/providers/BackgroundProvider";
import { siteConfig } from "@/siteConfig";

export default function BackgroundRenderer() {
  const { bgIndex } = useBackground();
  const images = siteConfig.bgImages || [];

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* 背景图轮换 — 全量渲染 + CSS opacity 切换 */}
      {images.map((img, i) => (
        <div
          key={img}
          className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === bgIndex % images.length ? 1 : 0,
            filter: i === bgIndex % images.length ? "blur(0px)" : "blur(4px)",
          }}
        />
      ))}

      {/* 多层液态玻璃覆盖 (BiliPai 风格 3 层模糊叠加) */}
      <div className="absolute inset-0 z-[-9] bg-white/10 dark:bg-slate-900/20" style={{ backdropFilter: "blur(80px) saturate(1.8)" }} />
      <div className="absolute inset-0 z-[-8] bg-white/25 dark:bg-slate-900/35" style={{ backdropFilter: "blur(40px) saturate(1.4)" }} />
      <div className="absolute inset-0 z-[-7] bg-white/35 dark:bg-slate-900/40" style={{ backdropFilter: "blur(20px) saturate(1.2)" }} />

      {/* 渐变流动层 */}
      <div
        className="absolute inset-0 z-[-6] opacity-40 dark:opacity-12 mix-blend-overlay transition-opacity duration-1000"
        style={{
          background: `linear-gradient(-45deg, var(--accent), var(--accent-light), var(--accent), ${siteConfig.themeColors?.[3] || "#c7d2fe"})`,
          backgroundSize: "400% 400%",
          animation: "gradientMove 15s ease infinite",
        }}
      />

      {/* 光斑 — 液态玻璃圆角高光 */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-white/15 dark:bg-indigo-900/10 blur-[120px] rounded-full z-[-5]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-400/15 dark:bg-purple-900/10 blur-[120px] rounded-full z-[-5]" />
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-white/10 dark:bg-slate-500/5 blur-[80px] rounded-full z-[-5]" />
    </div>
  );
}
