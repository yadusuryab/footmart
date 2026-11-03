"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, instagramUrl, whatsappUrl, telUrl } from "@/lib/site-config";
import Brand from "../brand/brand";

// Inline icons. Hoisted, so React never re-renders them. Zero icon-library bytes.
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-5 w-5",
  "aria-hidden": true,
} as const;

const instagramIcon = (
  <svg {...svgProps}>
    <path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
    <path d="M16.5 7.5v.01" />
  </svg>
);

const whatsappIcon = (
  <svg {...svgProps}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

const pill =
  "flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-none sm:px-6";

const legalLink =
  "transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/checkout") return null;
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="px-3 pb-3 pt-8 [contain-intrinsic-size:auto_460px] [content-visibility:auto] sm:px-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl bg-black p-5 text-white sm:p-8">
        <Link
          href="/"
          prefetch={false}
          aria-label={`${site.name} home`}
          className="flex w-fit items-center gap-3"
        >
          <Brand small />
          <span className="text-xl font-black italic">
            {site.brand.first}
            <span className="ml-0.5 rounded-md bg-primary px-1.5 py-0.5 text-black">
              {site.brand.accent}
            </span>
          </span>
        </Link>

        <div className="flex flex-col gap-1 rounded-2xl bg-primary p-4 text-black">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
            {site.labels.contact}
          </span>
          <a
            href={telUrl}
            className="w-fit text-lg font-black tracking-tight focus-visible:outline-none"
          >
            {site.phone}
          </a>
          {site.address && (
            <span className="text-xs font-medium leading-relaxed text-black/65">
              {site.address}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.labels.instagram}
            className={`${pill} ${site.theme.card} text-white`}
          >
            {instagramIcon}
            {site.labels.instagram}
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={site.labels.whatsapp}
            className={`${pill} ${site.theme.mesh} text-black`}
          >
            {whatsappIcon}
            {site.labels.whatsapp}
          </a>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-[11px] font-semibold text-white/50 sm:flex-row">
          <nav aria-label="Legal" className="flex gap-4">
            {site.legal.map((l) => (
              <Link key={l.href} href={l.href} prefetch={false} className={legalLink}>
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="tracking-wide">
            © {new Date().getFullYear()} {site.name.toUpperCase()}. {site.labels.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}