"use client";

/*
  Add once to globals.css (works in Tailwind v3 and v4):
  @keyframes marquee { to { transform: translateX(-50%); } }
*/

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";
import { Button } from "../ui/button";

const marqueeItems = ["Cash on Delivery", "All India Shipping", "Kerala Based"];

const menuLinks = [
  { label: "Home", href: "/" },
 { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/T&C" },
  { label: "Instagram", href: "https://instagram.com/footmart_" },
  { label: "Whatsapp", href: "https://wa.me/919876543210" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

// One text node per group. Hoisted, so React never re-renders it.
const GAP = "\u2003\u2003";
const strip = Array(8).fill(marqueeItems.join(GAP)).join(GAP) + GAP;

const marquee = (
  <div className="relative z-[60] h-7 w-full overflow-hidden bg-primary">
    <span className="sr-only">{marqueeItems.join(", ")}</span>
    <div
      aria-hidden
      className="flex w-max animate-[marquee_40s_linear_infinite] whitespace-nowrap font-bold leading-7 tracking-tighter text-white will-change-transform group-data-[scrolled=true]:[animation-play-state:paused] motion-reduce:animate-none"
    >
      <span>{strip}</span>
      <span>{strip}</span>
    </div>
  </div>
);

// Inline icons: zero icon-library bytes.
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-10 w-10",
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

const chip =
  "flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-4";

const burgerLine =
  "absolute left-1/2 top-1/2 -ml-2.5 -mt-px h-0.5 w-5 bg-white transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none";

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Passive listener. State only changes at the threshold, so no re-render spam.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  const tab = open ? 0 : -1;

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full">
        {/* Only this wrapper moves. The menu panel stays outside the transform. */}
        <div
          data-scrolled={scrolled}
          className={`group relative z-[60] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none ${
            scrolled ? "-translate-y-7" : "translate-y-0"
          }`}
        >
        {marquee}

        <div className="relative flex items-center justify-between gap-3 rounded-b-xl bg-primary px-4 py-2 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative h-10 w-10 shrink-0 rounded-full bg- focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className={`${burgerLine} ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`${burgerLine} ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>

            <Link
              href="/"
              prefetch={false}
              onClick={() => setOpen(false)}
              aria-label="Footmart Home"
              className="flex shrink-0 items-center gap-2"
            >
              <Brand small />
              <span className="hidden text-xl font-black italic text-black sm:inline">
                Foot
                <span className="ml-0.5 rounded-md bg-black px-1.5 py-0.5 text-primary">mart.</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              
             
            >
              <Button  className={`${chip} bg-white text-black`}>{instagramIcon}
              <span className=" sm:inline">@footmart_</span></Button>
            </Link>
            {/* <Link 
              href={`https://wa.me/${site.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <Button size="icon"  className={`${chip} bg-white  text-black `}>{whatsappIcon}
              <span className="hidden sm:inline">Chat</span></Button>
            </Link> */}
          </div>
        </div>
        </div>

        {/* Menu: transform-only animation, compositor-driven. */}
        <nav
          id="site-menu"
          aria-label="Main"
          aria-hidden={!open}
          className={`fixed inset-0 z-50 flex flex-col bg-black text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform motion-reduce:transition-none ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <ul className="flex flex-1 flex-col justify-center gap-1 px-6 pb-8 pt-32 sm:gap-2 sm:px-12 lg:px-20">
            {menuLinks.map((l, i) => (
              <li key={l.href} className="overflow-hidden">
                <Link
                  href={l.href}
                  prefetch={false}
                  tabIndex={tab}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${280 + i * 70}ms` : "0ms" }}
                  className={`group inline-block text-[clamp(2.5rem,9vw,6rem)] font-black italic leading-[1.05] tracking-tighter transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none motion-reduce:transition-none ${
                    open ? "translate-y-0" : "translate-y-[110%]"
                  }`}
                >
                  <span className="relative inline-block pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none">
                    {l.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? "650ms" : "0ms" }}
            className={`flex flex-col gap-4 border-t border-white/15 px-6 py-6 transition-[opacity,transform] duration-500 motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-20 ${
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    prefetch={false}
                    tabIndex={tab}
                    onClick={() => setOpen(false)}
                    className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-sm text-white/50">Cash on delivery. Shipping across India.</p>
          </div>
        </nav>
      </header>

      <div className="h-[104px]" />
    </>
  );
};

export default Header;