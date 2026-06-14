import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "文章归档 - 却nuy" };

export default function ArticlesPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 sm:px-10 py-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">文章归档</h1>

      <div className="flex flex-col gap-4">
        {posts.map(post => {
          const d = new Date(post.date + "T08:00:00+08:00");
          const year = d.getFullYear();
          const md = `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}`;

          return (
            <Link key={post.slug} href={`/posts/${post.slug}/`}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg hover:scale-[1.01] transition-all duration-300">
              <div className="text-right min-w-[80px]">
                <div className="text-xs text-slate-400">{year}</div>
                <div className="text-2xl font-black text-indigo-500">{md}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{post.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{post.excerpt}</p>
                <div className="flex gap-2 mt-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">← 返回首页</Link>
      </div>
    </div>
  );
}
