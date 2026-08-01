"use client";

import Link from "next/link";
import { Suspense } from "react";
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";
import { usePathname } from "next/navigation";

const marqueeItems = [
  "CASH ON DELIVERY AVAILABLE",
  "ALL INDIA DELIVERY",
  "KERALA BASED",
];

const Header = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <header className="fixed top-0 left-0 w-full z-50">
        <div className="w-full h-7 bg-black overflow-hidden flex items-center">
          <div
            className="flex whitespace-nowrap text-[11px] font-black tracking-widest text-primary uppercase"
            style={{ animation: "marquee-scroll 30s linear infinite" }}
          >
            {Array.from({ length: 3 }).map((_, setIndex) =>
              marqueeItems.map((item, itemIndex) => (
                <span key={`${setIndex}-${itemIndex}`} className="flex items-center mx-4">
                  {item}
                  <span className="mx-4 text-white">//</span>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="px-3 sm:px-6 pt-3 max-w-6xl mx-auto">
          <div className="relative flex items-center justify-between px-4 sm:px-6 h-16 rounded-2xl border border-white/40 bg-primary/60 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
            {/* glass highlight sheen */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-white/5 to-transparent" />

            <Link href="/" className="relative flex items-center gap-2 shrink-0" aria-label="Footmart Home">
              <Suspense fallback={<div className="w-10 h-10 rounded-full bg-black/10 animate-pulse" />}>
                <div className="bg-black/90 rounded-full p-1 border border-white/60">
                  <Brand small />
                </div>
              </Suspense>
              <span className="hidden sm:inline font-black text-xl italic text-white drop-shadow-sm">
                Foot<span className="text-black">mart.</span>
              </span>
            </Link>

            <div className="relative flex items-center gap-3">
              <Link
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-black/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <IconBrandInstagram className="w-4 h-4" />
              </Link>
              <Link
                href={`https://wa.me/${site.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-black/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="h-28" />
    </>
  );
};

export default Header;