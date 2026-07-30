"use client";

import Poster2 from "@/public/poster-3.avif";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

export function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full md:max-w-[400px] mx-auto px-4 sm:px-6">
      <Link
        href="/offer?price=1199"
        className="block relative group"
        onClick={() => setIsLoading(true)}
      >
        {/* Outer card — thick black border, hard offset shadow */}
        <div className="relative rounded-3xl overflow-hidden border-4 border-black shadow-[6px_6px_0_0_#000] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[8px_8px_0_0_#000]">

          {/* Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-primary/20 animate-pulse flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Poster image */}
          <Image
            src={Poster2}
            alt="BOGO at ₹999!"
            width={800}
            height={600}
            className={`w-full h-auto block transition-all duration-500 group-hover:scale-[1.02] ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${isLoading ? "opacity-70" : ""}`}
            priority
            quality={60}
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 600px"
            onLoad={() => setImageLoaded(true)}
            placeholder="blur"
          />

          {/* Diagonal speed-line badge, top-left — echoes logo motif */}
          <div className="absolute top-3 left-3 z-10 bg-black text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border-2 border-white -rotate-3 shadow-[2px_2px_0_0_#000]">
            Limited Drop
          </div>

          {/* Bottom CTA strip — solid, chunky, no glass */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="bg-primary border-t-4 border-black px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-black/60 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                  Buy One Get One Free
                </span>
                <span className="text-black font-black italic text-lg leading-tight">
                  Buy at ₹1499
                </span>
              </div>

              <button className="flex-shrink-0 flex items-center gap-1 bg-black text-white text-sm font-black px-4 py-2.5 rounded-full border-2 border-white shadow-[2px_2px_0_0_#000] transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-2 active:scale-95 whitespace-nowrap">
                Claim
                <IconArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 rounded-3xl bg-black/30 flex items-center justify-center z-20">
            <div className="bg-primary border-2 border-black rounded-full p-3 shadow-[3px_3px_0_0_#000]">
              <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}