"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { siteConfig } from "@/siteConfig";

interface BgContextType {
  bgIndex: number;
  switchBg: () => void;
  images: string[];
}

const BackgroundContext = createContext<BgContextType>({
  bgIndex: 0,
  switchBg: () => {},
  images: [],
});

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const images = siteConfig.bgImages || [];

  // 从 localStorage 恢复上一次的背景图位置
  const [bgIndex, setBgIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem("bgIndex");
      const idx = saved ? parseInt(saved, 10) : 0;
      return idx >= 0 && idx < images.length ? idx : 0;
    } catch { return 0; }
  });

  const switchBg = useCallback(() => {
    setBgIndex(prev => {
      const next = (prev + 1) % images.length;
      try { localStorage.setItem("bgIndex", String(next)); } catch {}
      return next;
    });
  }, [images.length]);

  // 自动轮播已关闭——用户手动切换时持久化到 localStorage
  // 如需恢复自动轮播，取消下面注释：
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setBgIndex(prev => (prev + 1) % images.length);
  //   }, 10000);
  //   return () => clearInterval(timer);
  // }, [images.length]);


  return (
    <BackgroundContext.Provider value={{ bgIndex, switchBg, images }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export const useBackground = () => useContext(BackgroundContext);
