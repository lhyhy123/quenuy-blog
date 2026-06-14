"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/siteConfig";

export default function SiteDashboard() {
  const [timeStr, setTimeStr] = useState("");
  const [uptimeStr, setUptimeStr] = useState("");

  const START_DATE = new Date(siteConfig.buildDate || "2024-01-01T00:00:00").getTime();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      const diff = now.getTime() - START_DATE;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setUptimeStr(`${days} 天`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-3xl glass-card overflow-hidden flex items-center h-16 transition-colors duration-700">
      {/* 时钟区域：骨架屏同步呼吸光（跟随全局 --pulse 节奏） */}
      <div className="bg-slate-900 dark:bg-black text-white px-6 h-full flex items-center font-mono text-xl font-black tracking-widest relative overflow-hidden">
        {!timeStr && <div className="absolute inset-0 skeleton" />}
        <span className="relative z-10">{timeStr || "00:00:00"}</span>
      </div>
      <div className="flex-1 px-6 flex items-center justify-between text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>博客已运行 {uptimeStr}</span>
        </div>
        <div className="flex gap-2">
          {(siteConfig.footerBadges || []).map(badge => (
            <span key={badge.name} className={`px-2 py-1 bg-white/50 dark:bg-slate-700/50 rounded-md shadow-sm text-xs font-bold ${badge.color}`}>
              {badge.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
