// components/sections/reviews-marquee.tsx
// Server component. No client JS, no fetch waterfall, no spinner, no <style> tag.
// Reuses the `marquee` keyframes from globals.css (the same ones the header uses):
//   @keyframes marquee { to { transform: translateX(-50%); } }

import Image from "next/image";
import { site } from "@/lib/site-config";

const CARD_W = 188; // card + gap, px. Used to size the loop.
const MIN_GROUP_PX = 2600; // one group must outrun ultrawide screens, or the loop shows a gap.

function MarqueeRow({
  images,
  reverse,
}: {
  images: string[];
  reverse?: boolean;
}) {
  // Repeat the set until one group is wider than any screen.
  const reps = Math.max(1, Math.ceil(MIN_GROUP_PX / (images.length * CARD_W)));
  const group = Array.from({ length: reps }).flatMap(() => images);
  // About 47px per second regardless of how many photos there are.
  const seconds = Math.round((group.length * CARD_W) / 47);

  return (
    <div className="overflow-hidden">
      <div
        style={{ animationDuration: `${seconds}s` }}
        className={`flex w-max animate-[marquee_40s_linear_infinite] will-change-transform hover:[animation-play-state:paused] motion-reduce:animate-none ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-3 pr-3"
          >
            {group.map((src, i) => (
              <div
                key={`${copy}-${i}`}
                className="relative h-64 w-36 shrink-0 overflow-hidden rounded-3xl bg-black/10 sm:h-80 sm:w-44"
              >
                <Image
                  src={src}
                  alt={copy === 0 ? "Customer review" : ""}
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  quality={50}
                  draggable={false}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsMarquee({ images }: { images: string[] }) {
  if (!images?.length) return null;

  // Two rows, opposite directions.
  const mid = Math.ceil(images.length / 2);
  const rowA = images.slice(0, mid);
  const rowB = images.slice(mid);

  return (
    // content-visibility skips layout, paint and animation until the section is near the screen.
    <section className="py-12 [contain-intrinsic-size:auto_760px] [content-visibility:auto]">
      <div className="mb-8 flex justify-center px-4">
        <h2 className="rounded-full bg-black px-5 py-2 text-2xl font-black italic tracking-tighter text-white sm:text-3xl">
          {site.reviews.title[0]}{" "}
          <span className={site.theme.accentText}>{site.reviews.title[1]}</span>
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow images={rowA} />
        {rowB.length > 0 && <MarqueeRow images={rowB} reverse />}
      </div>
    </section>
  );
}