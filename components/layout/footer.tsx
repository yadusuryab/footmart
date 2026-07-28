"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";

function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === "/checkout") return null;
  if (pathname?.startsWith("/admin")) return null;


  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/[0.08] rounded-t-3xl overflow-hidden">
      
      {/* Top gloss line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-[400px] md:max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Main grid */}
        <div className="flex flex-col items-center gap-6">

          {/* Brand centered */}

          {/* Divider */}

          {/* Contact pill */}
          <div className="w-full bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2">
              Contact
            </p>
            <div className="space-y-1 text-sm text-white/70">
              <div className="font-medium">{site.phone}</div>
              {site.address && (
                <div className="text-white/45 text-xs leading-relaxed">{site.address}</div>
              )}
            </div>
          </div>

          {/* Social row */}
          <div className="flex items-center gap-2">
            <Link
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group relative w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.05] flex items-center justify-center text-white/50 overflow-hidden transition-all duration-200 hover:scale-110 hover:text-white"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 [background:radial-gradient(circle_at_30%_107%,#fdf497,#fd5949_45%,#d6249f_60%,#285AEB_90%)]" />
              <IconBrandInstagram className="relative z-10 w-4 h-4" />
            </Link>

            <Link
              href={`https://wa.me/${site.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="group relative w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.05] flex items-center justify-center text-white/50 overflow-hidden transition-all duration-200 hover:scale-110 hover:text-white"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 [background:radial-gradient(circle_at_center,#25d366,#128c7e)]" />
              <IconBrandWhatsapp className="relative z-10 w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/30">
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/T&C" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
          <span className="tracking-wide">
            © {currentYear} {site.name.toUpperCase()}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export { Footer };