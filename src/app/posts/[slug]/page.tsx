import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/siteConfig";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "文章未找到" };
  return { title: `${post.title} - ${siteConfig.authorName}`, description: post.excerpt };
}

function renderMD(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^---$/gm, "<hr>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/g, "\n</p><p>\n")
    .replace(/\n/g, "<br>\n");
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto mt-24 px-4 py-12 text-center">
        <h1 className="text-3xl font-black">文章未找到</h1>
        <p className="text-slate-500 mt-2">slug: {slug}</p>
        <Link href="/" className="text-indigo-500 mt-4 block">← 返回首页</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 sm:px-10 py-12">
      {post.cover && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-8">
          <img
            src={post.cover}
            alt="封面"
            className="w-full h-full object-cover"
            style={{ viewTransitionName: `article-cover-${slug}` }}
          />
        </div>
      )}
      <header className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-slate-500">{post.date.replace(/-/g, ".")}</span>
          <span className="text-sm text-slate-400">{post.read_time}</span>
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full">#{tag}</span>
          ))}
        </div>
      </header>
      <article className="prose" dangerouslySetInnerHTML={{ __html: renderMD(post.body) }} />
      <div className="mt-12 text-center">
        <Link href="/" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors">← 返回首页</Link>
      </div>
    </div>
  );
}
