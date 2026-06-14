"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "glass_opacity";
const DEFAULT_OPACITY = 30;

// BiliPai LiquidGlassTuning 21参数联动分级
// progress: 0(透明CLEAR) → 0.5(适中BALANCED) → 1(磨砂FROSTED)
const LEVELS = [
  { label: "Clear", pct: 15, desc: "接近透明" },
  { label: "Balanced", pct: 40, desc: "适中质感" },
  { label: "Frosted", pct: 65, desc: "深度磨砂" },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function applyLiquidGlassTuning(opacity: number) {
  const root = document.documentElement;
  const pct = opacity / 100;
  // progress: 0(CLEAR) → 1(FROSTED)
  const progress = Math.max(0, Math.min(1, (pct - 0.05) / 0.65));

  // ── BiliPai 21参数联动的 Web 等价 ──
  // 表面透明度 surfaceAlpha: 0.12 → 0.42
  const surfaceAlpha = lerp(0.12, 0.42, progress);
  // 模糊强度 backdropBlurRadius: 3 → 30
  const blurPx = Math.round(lerp(3, 30, progress));
  // 饱和度: 1.8 → 1.2（模糊越强，饱和度越低避免过曝）
  const saturate = lerp(1.8, 1.2, progress).toFixed(1);
  // 白色高光 whiteOverlayAlpha: 0.012 → 0.11
  const whiteOverlayAlpha = lerp(0.012, 0.11, progress);
  // 折射强度: 0.5 → 0.14（值越小效果越强）
  const refractIntensity = lerp(0.50, 0.14, progress);
  // 色散: progress < 0.34 时有，之后衰减到 0
  const chromaticAmount = progress < 0.34 ? lerp(0.18, 0, progress / 0.34) : 0;
  // 指示器着色: 0.20 → 0.34
  const indicatorTintAlpha = lerp(0.20, 0.34, progress);
  // 景深效果
  const depthEnabled = progress < 0.8;

  // ── 写入 CSS 自定义属性 ──
  root.style.setProperty("--glass-opacity", String(surfaceAlpha));
  root.style.setProperty("--glass-blur", `${blurPx}px`);
  root.style.setProperty("--glass-saturate", saturate);
  root.style.setProperty("--glass-surface", String(surfaceAlpha));
  root.style.setProperty("--glass-white-overlay", String(whiteOverlayAlpha));
  root.style.setProperty("--glass-refract-intensity", String(refractIntensity));
  root.style.setProperty("--glass-chromatic", String(chromaticAmount));
  root.style.setProperty("--glass-indicator-tint", String(indicatorTintAlpha));
  root.style.setProperty("--glass-depth", depthEnabled ? "1" : "0");
  // 原始百分值（给UI显示用）
  root.style.setProperty("--glass-pct", String(pct));
  root.style.setProperty("--glass-progress", String(progress));

  // 动态注入 glass 类样式（用内联 style 覆盖 backdrop-filter 和 box-shadow）
  updateGlassStyles(surfaceAlpha, blurPx, saturate, whiteOverlayAlpha);

  try { localStorage.setItem(STORAGE_KEY, String(opacity)); } catch {}
}

function updateGlassStyles(surfaceAlpha: number, blurPx: number, saturate: string, whiteOverlay: number) {
  const id = "bili-glass-dynamic";
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  const bf = `blur(${blurPx}px) saturate(${saturate})`;
  const wbf = `-webkit-${bf}`;
  el.textContent = `
    :root {
      --glass-bf: ${bf};
      --glass-wbf: ${wbf};
      --glass-surface-alpha: ${surfaceAlpha};
      --glass-white-overlay: ${whiteOverlay};
    }
    .glass-deep {
      backdrop-filter: ${bf};
      -webkit-backdrop-filter: ${bf};
    }
    .glass-card {
      backdrop-filter: ${bf} brightness(1.1);
      -webkit-backdrop-filter: ${bf} brightness(1.1);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,${(0.6 + whiteOverlay * 10).toFixed(2)}),
        inset 0 -2px 6px rgba(0,0,0,${(0.02 + whiteOverlay * 0.5).toFixed(2)}),
        0 4px 24px rgba(0,0,0,${(0.06 + surfaceAlpha * 0.3).toFixed(2)}),
        0 0 0 0.5px rgba(255,255,255,${(0.15 + whiteOverlay * 2).toFixed(2)});
    }
    .glass-nav {
      backdrop-filter: ${bf} brightness(1.15);
      -webkit-backdrop-filter: ${bf} brightness(1.15);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,${(0.6 + whiteOverlay * 10).toFixed(2)}),
        inset 0 -1px 0 rgba(255,255,255,${(0.04 + whiteOverlay).toFixed(2)}),
        0 2px 20px rgba(0,0,0,${(0.04 + surfaceAlpha * 0.2).toFixed(2)});
    }
    .dark .glass-card {
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,${(0.12 + whiteOverlay * 3).toFixed(2)}),
        inset 0 -2px 6px rgba(0,0,0,0.15),
        0 4px 24px rgba(0,0,0,${(0.2 + surfaceAlpha * 0.4).toFixed(2)}),
        0 0 0 0.5px rgba(255,255,255,${(0.06 + whiteOverlay).toFixed(2)});
    }
    .dark .glass-nav {
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,${(0.1 + whiteOverlay * 2).toFixed(2)}),
        inset 0 -1px 0 rgba(0,0,0,0.15),
        0 2px 20px rgba(0,0,0,${(0.2 + surfaceAlpha * 0.3).toFixed(2)});
    }
  `;
}

export function useGlassOpacity() {
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setOpacity(Number(saved)); } catch {}
  }, []);
  useEffect(() => { applyLiquidGlassTuning(opacity); }, [opacity]);
  return { opacity, setOpacity };
}

export default function GlassOpacityControl() {
  const [open, setOpen] = useState(false);
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setOpacity(Number(saved)); } catch {}
  }, []);

  useEffect(() => { applyLiquidGlassTuning(opacity); }, [opacity]);

  const progress = Math.max(0, Math.min(1, (opacity / 100 - 0.05) / 0.65));
  const currentBlur = Math.round(lerp(3, 30, progress));

  // 根据 progress 判断当前等级
  const currentLevelIndex = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-slate-700/50 transition-colors text-sm"
        title="液态玻璃强度"
      >
        🔲
      </button>
      {open && (
        <div className="absolute top-12 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl p-4 w-64 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              液态玻璃 · {LEVELS[currentLevelIndex].desc}
            </span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm">✕</button>
          </div>

          {/* 三级预设 */}
          <div className="flex gap-1.5 mb-3">
            {LEVELS.map((lv, i) => (
              <button
                key={lv.pct}
                onClick={() => setOpacity(lv.pct)}
                className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${
                  currentLevelIndex === i
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <div>{lv.label}</div>
                <div className="opacity-60 mt-0.5">{lv.desc}</div>
              </button>
            ))}
          </div>

          {/* 连续滑杆 */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">透</span>
            <input
              type="range"
              min="5"
              max="70"
              value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-[10px] text-slate-400">磨</span>
          </div>
          <div className="text-center mt-1.5 text-[10px] text-slate-500 font-mono">
            blur:{currentBlur}px · α:{Math.round(opacity)}% · sat:{lerp(1.8, 1.2, progress).toFixed(1)}x
          </div>
        </div>
      )}
    </div>
  );
}
