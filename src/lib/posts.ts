import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 使用绝对路径避免 cwd 问题
const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const PAGES_DIR = path.join(ROOT, "content", "pages");


export interface Post {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  read_time: string;
  slug: string;
  body: string;
  cover?: string;
}

export interface PageData {
  title: string;
  type: string;
  body: string;
  [key: string]: any;
}

export interface Friend {
  name: string;
  url: string;
  desc: string;
  icon?: string;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));
  
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const dateStr = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date || "");
    return {
      title: data.title || "未命名",
      date: dateStr,
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      excerpt: data.excerpt || "",
      read_time: data.read_time || "5 分钟阅读",
      slug: data.slug || file.replace(".md", ""),
      cover: data.cover || undefined,
      body: content.trim(),
    };
  });
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}

export function getPageData(name: string): PageData | null {
  const fp = path.join(PAGES_DIR, `${name}.md`);
  if (!fs.existsSync(fp)) return null;
  const { data, content } = matter(fs.readFileSync(fp, "utf-8"));
  return { ...data, body: content.trim() } as PageData;
}
