import Link from "next/link";
import { siteConfig } from "@/siteConfig";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/15 dark:border-white/5 glass-card py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 mb-4 text-sm font-bold text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-500 transition-colors">首页</Link>
          <Link href="/articles/" className="hover:text-indigo-500 transition-colors">文章</Link>
          <Link href="/feed/" className="hover:text-indigo-500 transition-colors">RSS</Link>
          <Link href="/friends/" className="hover:text-indigo-500 transition-colors">友链</Link>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} {siteConfig.authorName} · &quot;风会带来一切的。&quot;
        </p>
        {siteConfig.icpConfig && (
          <a href={siteConfig.icpConfig.link} target="_blank" rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-indigo-500 transition-colors mt-1 block">
            {siteConfig.icpConfig.name}
          </a>
        )}
      </div>
    </footer>
  );
}
