import type { Metadata } from "next";

export const metadata: Metadata = { title: "RSS 订阅 - 却nuy" };

export default function FeedPage() {
  return (
    <div className="max-w-xl mx-auto mt-24 px-4 py-12 text-center">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">RSS 订阅</h1>
      <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg">
        <code className="block p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm break-all mb-4">https://quenuy.top/rss.xml</code>
        <p className="text-sm text-slate-500">将以上地址复制到任意 RSS 阅读器即可订阅</p>
      </div>
    </div>
  );
}
