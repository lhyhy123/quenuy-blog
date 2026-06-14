"use client";

import { siteConfig } from "@/siteConfig";
import { useState } from "react";
import Link from "next/link";

export default function PhotowallPage() {
  const images = siteConfig.bgImages || [];
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-10 py-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">照片墙</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} onClick={() => setSelected(i)}
            className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform shadow-lg border border-white/20">
            <img src={img} alt={`背景 ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {selected !== null && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center cursor-pointer"
          style={{ backdropFilter: "blur(10px)" }}>
          <img src={images[selected]} className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl" alt="预览" />
        </div>
      )}
      <div className="text-center mt-8">
        <Link href="/" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">← 返回首页</Link>
      </div>
    </div>
  );
}
