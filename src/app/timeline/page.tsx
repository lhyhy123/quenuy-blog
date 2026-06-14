import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "时光河流 - 却nuy" };

export default function TimelinePage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 sm:px-10 py-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">时光河流</h1>
      <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 pl-8 ml-4">
        {posts.map((post) => {
          const d = new Date(post.date + "T08:00:00+08:00");
          return (
            <div key={post.slug} className="mb-10 relative">
              <div className="absolute -left-[45px] top-0 w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black shadow-lg border-2 border-white dark:border-slate-900">
                {d.getMonth() + 1}
              </div>
              <Link href={`/posts/${post.slug}/`} className="block p-5 rounded-2xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg hover:scale-[1.01] transition-all">
                <span className="text-xs text-slate-400">{d.getFullYear()}年{d.getMonth() + 1}月{d.getDate()}日</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{post.title}</h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
