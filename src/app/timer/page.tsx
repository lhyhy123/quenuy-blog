"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 目标日期
const TARGET_DATE = new Date("2027-12-18T00:00:00+08:00");
const TARGET_LABEL = "2028 考研";

function calcTimeLeft() {
  const now = Date.now();
  const diff = TARGET_DATE.getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    passed: false,
  };
}

export default function TimerPage() {
  const [time, setTime] = useState(calcTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-24 px-4 py-12 text-center">
      <h2 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-4">{TARGET_LABEL} 倒计时</h2>

      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        <div className="glass-card rounded-2xl px-2 py-4 flex flex-col items-center justify-center" style={{ width: 100 }}>
          <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">{String(time.days).padStart(3, "0")}</span>
          <span className="text-xs font-bold text-slate-500 mt-1">天</span>
        </div>
        <div className="glass-card rounded-2xl px-2 py-4 flex flex-col items-center justify-center" style={{ width: 100 }}>
          <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">{String(time.hours).padStart(2, "0")}</span>
          <span className="text-xs font-bold text-slate-500 mt-1">时</span>
        </div>
        <div className="glass-card rounded-2xl px-2 py-4 flex flex-col items-center justify-center" style={{ width: 100 }}>
          <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">{String(time.minutes).padStart(2, "0")}</span>
          <span className="text-xs font-bold text-slate-500 mt-1">分</span>
        </div>
        <div className="glass-card rounded-2xl px-2 py-4 flex flex-col items-center justify-center" style={{ width: 100 }}>
          <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">{String(time.seconds).padStart(2, "0")}</span>
          <span className="text-xs font-bold text-slate-500 mt-1">秒</span>
        </div>
      </div>

      {time.passed && <p className="text-indigo-500 font-bold mb-4 text-xl">🎉 时间到！</p>}

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
        目标：{TARGET_DATE.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <Link href="/stuff/" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">← 返回杂物间</Link>
    </div>
  );
}
