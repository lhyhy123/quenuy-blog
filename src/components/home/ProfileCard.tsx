"use client";

import { useRouter } from "next/navigation";
import { siteConfig } from "@/siteConfig";

export default function ProfileCard({ postCount }: { postCount: number }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/about/")}
      className="md:col-span-8 rounded-3xl glass-card p-6 md:p-8 flex flex-col justify-between transition-all duration-700 hover:scale-[1.01] cursor-pointer group relative overflow-hidden h-full min-h-[240px]"
    >
      <div className="flex items-start gap-4 md:gap-6 relative z-10">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-lg flex-shrink-0 transition-transform duration-500 group-hover:rotate-3">
          <img src={siteConfig.avatarUrl} alt="avatar" className="w-full h-full rounded-xl object-cover bg-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 pb-1 leading-snug tracking-wider transition-colors duration-700">
            {siteConfig.authorName}
          </h1>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-md transition-colors duration-700 line-clamp-2">
            {siteConfig.bio}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between mt-6 md:mt-8 relative z-10">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{postCount}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">文章</div>
          </div>
        </div>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          {siteConfig.social?.github && (
            <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-700/50 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-300 border border-white/40 dark:border-white/10"
              title="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
          )}
          {siteConfig.social?.email && (
            <a href={`mailto:${siteConfig.social.email}`}
              className="w-10 h-10 rounded-xl bg-white/50 dark:bg-slate-700/50 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-300 border border-white/40 dark:border-white/10"
              title="Email">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
