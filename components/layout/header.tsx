"use client";

import Link from "next/link";
import { Suspense } from "react";
import { IconBrandInstagram, IconBrandWhatsapp, IconMenu2 } from "@tabler/icons-react";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";
import { usePathname } from "next/navigation";

// Define marquee items as a configurable list
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
        {/* speed-line marquee strip */}
        <div className="w-full h-7 bg-black overflow-hidden flex items-center border-b-2 border-primary">
          <div
            className="flex whitespace-nowrap text-[11px] font-black tracking-widest text-primary uppercase"
            style={{ animation: "marquee-scroll 30s linear infinite" }}
          >
            {/* Map through items and duplicate for seamless looping */}
            {Array.from({ length: 3 }).map((_, setIndex) => (
              marqueeItems.map((item, itemIndex) => (
                <span key={`${setIndex}-${itemIndex}`} className="flex items-center mx-4">
                  {item}
                  <span className="mx-4 text-white">//</span>
                </span>
              ))
            ))}
          </div>
        </div>

        {/* main bar */}
        <div className="relative bg-primary border-b-4 border-black">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #000 0 2px, transparent 2px 24px)",
            }}
            aria-hidden="true"
          />

          <div className="relative flex items-center justify-between px-4 sm:px-6 h-16 max-w-6xl mx-auto">
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Footmart Home">
              <Suspense fallback={<div className="w-12 h-12 rounded-full bg-black/10 animate-pulse" />}>
                <div className="bg-black rounded-full p-1 border-2 border-white shadow-[3px_3px_0_0_#000]">
                  <Brand small />
                </div>
              </Suspense>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="font-black text-2xl italic text-white drop-shadow-[2px_2px_0_#000]">
                  Foot<span className="text-black">mart.</span>
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-9 h-9 rounded-full bg-black text-white border-2 border-white flex items-center justify-center shadow-[2px_2px_0_0_#000] transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]"
              >
                <IconBrandInstagram className="w-4 h-4" />
              </Link>

              <Link
                href={`https://wa.me/${site.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="w-9 h-9 rounded-full bg-black text-white border-2 border-white flex items-center justify-center shadow-[2px_2px_0_0_#000] transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* bottom zig-zag edge */}
          <div
            className="absolute -bottom-2 left-0 w-full h-2 bg-primary"
            style={{
              clipPath:
                "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)",
            }}
            aria-hidden="true"
          />
        </div>
      </header>

      <div className="h-24" />
    </>
  );
};

export default Header;