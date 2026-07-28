"use client";

import Link from "next/link";
import { Suspense } from "react";
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <style>{`
        @keyframes shimmer-slide {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes refract-drift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[520px]">

        <div
          className="absolute -inset-2 rounded-full bg-primary/45 blur-lg animate-pulse pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="relative rounded-full overflow-hidden border border-primary/40 bg-primary/60 backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.35)] p-1">

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
              animation: "shimmer-slide 4s ease-in-out infinite",
            }}
          />

          <div
            className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none opacity-40"
            style={{
              background: "linear-gradient(270deg, rgba(255,100,200,0.06), rgba(100,180,255,0.06), rgba(200,255,180,0.04))",
              backgroundSize: "300% 300%",
              animation: "refract-drift 6s ease infinite",
            }}
          />

          <div className="flex items-center justify-between gap-3 px-1">

            <Link href="/" className="flex items-center gap-2" aria-label="Kicksnot Home">
              <Suspense fallback={<div className="w-6 h-6 rounded-full bg-white/10 animate-pulse" />}>
                <Brand />
                <h2 className="font-bold text-lg text-white drop-shadow-sm">
                  Kicksnot
                </h2>
              </Suspense>
            </Link>

            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] px-2.5 py-2">

              <Link
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="group/ig relative w-8 h-8 rounded-full border border-white/15 bg-primary/40 flex items-center justify-center text-white/75 overflow-hidden transition-all duration-200 hover:scale-110 hover:text-white"
              >
                <span className="absolute inset-0 opacity-0 group-hover/ig:opacity-100 transition-opacity duration-200 [background:radial-gradient(circle_at_30%_107%,#fdf497,#fd5949_45%,#d6249f_60%,#285AEB_90%)]" />
                <IconBrandInstagram className="relative z-10 w-3.5 h-3.5" />
              </Link>

              <Link
                href={`https://wa.me/${site.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="group/wa relative w-8 h-8 rounded-full border border-white/15 bg-primary/40 flex items-center justify-center text-white/75 overflow-hidden transition-all duration-200 hover:scale-110 hover:text-white"
              >
                <span className="absolute inset-0 opacity-0 group-hover/wa:opacity-100 transition-opacity duration-200 [background:radial-gradient(circle_at_center,#25d366,#128c7e)]" />
                <IconBrandWhatsapp className="relative z-10 w-3.5 h-3.5" />
              </Link>

            </div>
          </div>
        </div>
      </header>

      <div className="h-20" />
    </>
  );
};

export default Header;