import { getPageData } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "杂物 - 却nuy" };

export default function StuffPage() {
  const data = getPageData("stuff");

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 sm:px-10 py-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">杂物间</h1>

      {data?.countdown && (
        <div className="text-center mb-8">
          <Link href={data.countdown.link || "/timer/"}
            className="inline-flex px-6 py-3 rounded-full bg-indigo-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">
            {data.countdown.button || "开始计时 →"}
          </Link>
        </div>
      )}

      {data?.devices && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.devices.map((d: any, i: number) => (
            <div key={i} className="p-5 rounded-2xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg text-center">
              <div className="text-2xl mb-2">{d.icon}</div>
              <div className="font-bold text-slate-900 dark:text-white">{d.name}</div>
              <div className="text-xs text-slate-500 mt-1">{d.spec}</div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">← 返回首页</Link>
      </div>
    </div>
  );
}
