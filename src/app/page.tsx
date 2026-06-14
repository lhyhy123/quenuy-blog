import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/siteConfig";
import HomeClient from "./HomeClient";

export default function Home() {
  const posts = getAllPosts();
  const chatterCount = 2; // 目前 2 篇文章也算入

  return (
    <HomeClient
      posts={posts.slice(0, 5).map(p => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover: p.cover || undefined,
        date: p.date,
        tags: p.tags,
      }))}
      postCount={posts.length}
      chatterCount={chatterCount}
    />
  );
}
