import { getPageData } from "@/lib/posts";
import { siteConfig } from "@/siteConfig";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = { title: `关于 - ${siteConfig.authorName}` };

export default function AboutPage() {
  const data = getPageData("about");

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="max-w-3xl mx-auto mt-24 px-4 sm:px-10 py-12">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg mb-4">
              <img src={siteConfig.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover bg-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{data?.name || siteConfig.authorName}</h1>
          </div>

          <div className="prose mx-auto">
            {data?.bio?.map((line: string, i: number) => (
              <p key={i}>{line}</p>
            ))}
            {data?.body && <div dangerouslySetInnerHTML={{ __html: data.body }} />}
          </div>
        </div>
      </PageTransition>
    </>
  );
}
