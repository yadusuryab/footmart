import Image from "next/image";
import Link from "next/link";
import poster from "@/public/hero-image.avif";

// Hoisted static markup. React never re-renders it. Zero icon-library bytes.
const arrow = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
    aria-hidden
  >
    <path d="M17 7L7 17" />
    <path d="M8 7h9v9" />
  </svg>
);

// Server component. No client JS, no state, no keyframes, no extra requests.
// All motion is transform/opacity only, so it runs on the compositor.
export function Hero() {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 md:max-w-[400px]">
      <Link
        href="/offer?price=1199"
        prefetch={false}
        className="group flex touch-manipulation select-none flex-col gap-3 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none"
      >
        {/* Poster */}
        <div className="relative overflow-hidden rounded-3xl bg-primary/20">
          <Image
            src={poster}
            alt="Buy one get one offer"
            priority
            quality={55}
            sizes="(max-width: 448px) 92vw, 400px"
            className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] group-active:scale-[1.01] motion-reduce:transition-none"
          />
          <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black py-1.5 pl-2.5 pr-3 text-xs font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Limited drop
          </span>
        </div>

        {/* Detached CTA: squishes on press, springs back on release. */}
        <span className="relative flex items-center justify-between overflow-hidden rounded-full bg-black p-1.5 pl-6 text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-[150%] before:-skew-x-12 before:bg-white/20 before:transition-transform before:duration-700 group-hover:-translate-y-0.5 group-hover:before:translate-x-[550%] group-active:translate-y-0 group-active:scale-[0.96] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-black motion-reduce:transition-none motion-reduce:before:hidden">
          <span className="text-xl font-bold transition-transform duration-200 group-active:translate-x-1 motion-reduce:transition-none">
            CLAIM OFFER
          </span>

          <span className="relative grid h-11 w-11 place-items-center rounded-full bg-primary text-black transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 motion-reduce:transition-none">
            {/* Tap cue: single ping ring, paused while touched. */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary opacity-40 group-hover:animate-none group-active:animate-none motion-reduce:animate-none"
            />
            {arrow}
          </span>
        </span>
      </Link>
    </div>
  );
}