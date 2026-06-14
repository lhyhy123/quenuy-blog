import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto mt-24 px-4 py-12 text-center">
      <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
      <p className="text-slate-500 mb-8">页面不存在</p>
      <Link href="/" className="text-indigo-500 font-bold hover:text-indigo-600 transition-colors">← 回到首页</Link>
    </div>
  );
}
