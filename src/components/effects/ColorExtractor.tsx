"use client";

import { useEffect, useCallback } from "react";
import { useBackground } from "@/components/providers/BackgroundProvider";
import { siteConfig } from "@/siteConfig";

// HSL 工具函数
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sN = s / 100, lN = l / 100;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return lN - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

// 生成 Material You 风格的颜色组
function generateAccentPalette(r: number, g: number, b: number) {
  const [h, s, l] = rgbToHsl(r, g, b);

  // 主色 = 原色饱和度提升、亮度调整到 Material 3 范围
  const [ar, ag, ab] = hslToRgb(h, Math.min(s + 10, 85), Math.min(Math.max(l, 35), 60));
  // 浅色 = 饱和度降低、亮度提升
  const [lr, lg, lb] = hslToRgb(h, Math.max(s - 15, 20), Math.min(l + 25, 85));
  // 深色（暗黑模式主色）= 饱和度略降、亮度提升
  const [dr, dg, db] = hslToRgb((h + 15) % 360, Math.max(s - 10, 25), Math.min(l + 30, 80));

  return {
    accent: `rgb(${ar},${ag},${ab})`,
    accentLight: `rgb(${lr},${lg},${lb})`,
    accentSoft: `rgba(${ar},${ag},${ab},0.08)`,
    accentGlow: `rgba(${ar},${ag},${ab},0.18)`,
    accentDark: `rgb(${dr},${dg},${db})`,
    accentDarkGlow: `rgba(${dr},${dg},${db},0.22)`,
  };
}

export default function ColorExtractor() {
  const { bgIndex } = useBackground();
  const images = siteConfig.bgImages || [];

  const extract = useCallback(() => {
    if (!images.length) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = images[bgIndex % images.length];
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 60;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 100, 60);
      const data = ctx.getImageData(0, 0, 100, 60).data;
      const samples: number[][] = [];
      for (let i = 0; i < data.length; i += 80) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const brightness = (r + g + b) / 3;
        if (brightness < 20 || brightness > 235) continue;
        samples.push([r, g, b]);
      }
      if (samples.length < 5) return;
      let ar = 0, ag = 0, ab = 0;
      samples.forEach(s => { ar += s[0]; ag += s[1]; ab += s[2]; });
      ar = Math.round(ar / samples.length);
      ag = Math.round(ag / samples.length);
      ab = Math.round(ab / samples.length);

      // MD3 基础令牌
      const root = document.documentElement;
      const a = (op: number) => `rgba(${ar},${ag},${ab},${op})`;
      root.style.setProperty("--md3-surface", a(0.6));
      root.style.setProperty("--md3-surface-glass", a(0.45));
      root.style.setProperty("--md3-primary-tint", a(0.08));
      root.style.setProperty("--md3-glow", a(0.15));

      // 新增：动态 accent 色（Material You 风格）
      const palette = generateAccentPalette(ar, ag, ab);
      root.style.setProperty("--accent", palette.accent);
      root.style.setProperty("--accent-light", palette.accentLight);
      root.style.setProperty("--accent-soft", palette.accentSoft);
      root.style.setProperty("--accent-glow", palette.accentGlow);
      root.style.setProperty("--accent-dark", palette.accentDark);
      root.style.setProperty("--accent-dark-glow", palette.accentDarkGlow);
    };
  }, [bgIndex, images]);

  useEffect(() => { extract(); }, [extract]);

  return null;
}
