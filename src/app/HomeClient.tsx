"use client";

import SearchBar from "@/components/ui/SearchBar";
import ProfileCard from "@/components/home/ProfileCard";
import CloudPlayer from "@/components/home/CloudPlayer";
import LatestPostsCarousel from "@/components/home/LatestPostsCarousel";
import SiteDashboard from "@/components/home/SiteDashboard";
import PhotoWallPreview from "@/components/home/PhotoWallPreview";
import FadeIn from "@/components/ui/FadeIn";

interface PostItem {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string;
  date?: string;
  tags?: string[];
}

export default function HomeClient({
  posts, postCount,
}: {
  posts: PostItem[];
  postCount: number;
  chatterCount: number;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto py-6 md:py-12 px-4 sm:px-10 relative z-10">
      <FadeIn step="step1"><SearchBar posts={posts} /></FadeIn>

      <main className="flex flex-col gap-4 md:gap-6 w-full">
        <FadeIn step="step2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full items-stretch">
            <div className="md:col-span-8 flex w-full"><ProfileCard postCount={postCount} /></div>
            <div className="md:col-span-4 flex w-full"><CloudPlayer /></div>
          </div>
        </FadeIn>

        <FadeIn step="step3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full items-stretch">
            <div className="md:col-span-8 h-full"><LatestPostsCarousel posts={posts} /></div>
            <div className="md:col-span-4 h-full"><PhotoWallPreview /></div>
          </div>
        </FadeIn>

        <FadeIn step="step4"><SiteDashboard /></FadeIn>
      </main>
    </div>
  );
}
