"use client";

import { siteConfig } from "@/siteConfig";
import { useBackground } from "@/components/providers/BackgroundProvider";
import Link from "next/link";

export default function PhotoWallPreview() {
  const images = siteConfig.bgImages || [];
  const { bgIndex } = useBackground();
  const cover = images.length > 0 ? images[bgIndex % images.length] : "/images/bg/bg0.jpg";

  return (
    <Link href="/photowall/"
      className="block rounded-3xl glass-card overflow-hidden relative group min-h-[200px] h-full flex flex-col transition-all duration-700 hover:scale-[1.01]">
      <img src={cover} className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out group-hover:scale-105 opacity-80" alt="照片墙" />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      <div className="absolute bottom-4 left-6 right-6">
        <h3 className="text-2xl font-bold text-white mb-1">照片墙</h3>
        <p className="text-white/80 text-sm">{images.length} 张背景</p>
      </div>
    </Link>
  );
}
