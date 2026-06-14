"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TITLE_MAP: Record<string, string> = {
  "/articles/": "文章归档",
  "/about/": "关于",
  "/friends/": "友链",
  "/stuff/": "杂物间",
  "/timer/": "专注时钟",
  "/feed/": "RSS 订阅",
  "/timeline/": "时光河流",
  "/photowall/": "照片墙",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const title = TITLE_MAP[pathname] ||
    (pathname.startsWith("/posts/") ? "文章详情" : pathname);

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 px-4 sm:px-10 relative z-10">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-indigo-500 transition-colors">首页</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200">{title}</span>
      </div>
    </div>
  );
}
