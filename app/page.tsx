// app/page.tsx
// Server component: no "use client". Reviews are read on the server and sent in the first HTML.

import { Hero } from "@/components/sections/hero";
import { ReviewsMarquee } from "@/components/sections/review-marquee";
import { ShopVideo } from "@/components/sections/shop-video";
import { WhatsAppButton } from "@/components/utils/wp";
import { getReviewImages } from "@/lib/reviews";
import { site } from "@/lib/site-config";

// Rebuild the page at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const images = await getReviewImages();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />

      {site.video.enabled && (
        <div className="mx-auto w-full max-w-[440px] px-4 py-8">
          <ShopVideo />
        </div>
      )}

      {/* Full width on purpose, so the marquee runs edge to edge. */}
      <ReviewsMarquee images={images} />

      <WhatsAppButton />
    </main>
  );
}