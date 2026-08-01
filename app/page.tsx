"use client";

import BrandStory from "@/components/sections/brand-story-about";
import { Hero } from "@/components/sections/hero";
import { ReviewsMarquee } from "@/components/sections/review-marquee";
import { ProductCardWithSale } from "@/components/sections/sale-is-live";
import { ShopVideo } from "@/components/sections/shop-video";


export default function Home() {
  return (
    <div
      className="flex py-0 flex-col min-h-screen bg-primary/10"
    
    >
      <div className="relative overflow-hidden">
        <div className="px-4 pt-6">
          <Hero />
        </div>
      </div>

      <div className="px-4 py-8">
        <ShopVideo />
      </div>


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