import { getPageData, type Friend } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "友链 - 却nuy" };

export default function FriendsPage() {
  const data = getPageData("friends");
  const friends: Friend[] = data?.friends || [];

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 sm:px-10 py-12">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center">友链</h1>
      {data?.description && (
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{data.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {friends.map((friend, i) => (
          <a key={i} href={friend.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {friend.name[0]}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-white">{friend.name}</div>
              <div className="text-xs text-slate-500 truncate">{friend.desc}</div>
            </div>
          </a>
        ))}
      </div>

      {friends.length === 0 && (
        <p className="text-center text-slate-400 py-12">暂无友链，欢迎交换~</p>
      )}
    </div>
  );
}
