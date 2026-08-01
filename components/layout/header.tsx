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
        <div className="w-full h-7 bg-black overflow-hidden flex items-center border-b-2 border-primary">
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

        <div className="bg-primary border-b-2 border-black">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-6xl mx-auto">
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Footmart Home">
              <Suspense fallback={<div className="w-10 h-10 rounded-full bg-black/10 animate-pulse" />}>
                <div className="bg-black rounded-full p-1 border-2 border-white">
                  <Brand small />
                </div>
              </Suspense>
              <span className="hidden sm:inline font-black text-xl italic text-white">
                Foot<span className="text-black">mart.</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <IconBrandInstagram className="w-4 h-4" />
              </Link>
              <Link
                href={`https://wa.me/${site.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="h-23" />
    </>
  );
};

export default Header;