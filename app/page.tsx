"use client";

import BrandStory from "@/components/sections/brand-story-about";
import { Hero } from "@/components/sections/hero";
import { ReviewsMarquee } from "@/components/sections/review-marquee";
import { ProductCardWithSale } from "@/components/sections/sale-is-live";
import { ShopVideo } from "@/components/sections/shop-video";

const ZigDivider = () => (
  <div
    className="w-full h-3 bg-primary"
    style={{
      clipPath:
        "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
    }}
    aria-hidden="true"
  />
);

export default function Home() {
  return (
    <div
      className="flex py-0 flex-col min-h-screen bg-primary/10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0 40px, transparent 40px 80px), repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0 40px, transparent 40px 80px)",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="px-4 pt-6">
          <Hero />
        </div>
      </div>

      <div className="px-4 py-8">
        <ShopVideo />
      </div>

      <ZigDivider />

      <div className="px-4 py-8">
        <ReviewsMarquee />
      </div>

      {/* <div className="px-4 my-8">
        <ProductCardWithSale />
      </div>*/}

      {/* <BrandStory /> */}
    </div>
  );
}