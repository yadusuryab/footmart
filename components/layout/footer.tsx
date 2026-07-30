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
    <footer className="relative bg-black rounded-t-3xl overflow-hidden border-t-4 border-primary">
      {/* zig-zag top edge, echoes header */}
      <div
        className="absolute top-0 left-0 w-full h-2 bg-primary"
        style={{
          clipPath:
            "polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[400px] md:max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center gap-6">

          {/* Brand centered */}
          <div className="bg-primary rounded-full p-1 border-2 border-white shadow-[3px_3px_0_0_#000]">
            <div className="bg-black rounded-full p-1">
              <Brand small />
            </div>
          </div>

          {/* Contact card */}
          <div className="w-full bg-primary text-black border-2 border-white rounded-2xl px-5 py-4 shadow-[3px_3px_0_0_theme(colors.primary.DEFAULT/0.3)]">
            <p className="text-black/60 text-[10px] font-black uppercase tracking-widest mb-2">
              Contact
            </p>
            <div className="space-y-1 text-sm">
              <div className="font-black">{site.phone}</div>
              {site.address && (
                <div className="text-black/60 text-xs leading-relaxed font-medium">{site.address}</div>
              )}
            </div>
          </div>

          {/* Social row */}
          <div className="flex items-center gap-3">
            <Link
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group relative w-10 h-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-primary overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 shadow-[2px_2px_0_0_#000]"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 [background:radial-gradient(circle_at_30%_107%,#fdf497,#fd5949_45%,#d6249f_60%,#285AEB_90%)]" />
              <IconBrandInstagram className="relative z-10 w-4 h-4 group-hover:text-white" />
            </Link>

            <Link
              href={`https://wa.me/${site.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="group relative w-10 h-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-primary overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 shadow-[2px_2px_0_0_#000]"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 [background:radial-gradient(circle_at_center,#25d366,#128c7e)]" />
              <IconBrandWhatsapp className="relative z-10 w-4 h-4 group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t-2 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-bold text-white/40">
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/T&C" className="hover:text-primary transition-colors">Terms</Link>
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