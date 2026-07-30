// components/sections/reviews-marquee.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function MarqueeRow({
  images,
  direction,
  speedSeconds,
}: {
  images: string[];
  direction: "left" | "right";
  speedSeconds: number;
}) {
  // Duplicate the list so the strip can loop seamlessly.
  const doubled = [...images, ...images];

  return (
    <div className="group relative overflow-hidden">
      <div
        className="flex w-max gap-4 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${speedSeconds}s linear infinite`,
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-64 w-36 shrink-0 overflow-hidden rounded-2xl border-4 border-black shadow-[4px_4px_0_0_#000] sm:h-80 sm:w-44 even:-rotate-2 odd:rotate-2"
          >
            <Image
              src={src}
              alt="Customer review"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: { images: string[] }) => {
        if (!cancelled) setImages(data.images ?? []);
      })
      .catch(() => {
        if (!cancelled) setImages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex justify-center gap-2 text-sm font-bold uppercase tracking-widest text-black/50">
          <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
          Loading reviews…
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  // Split into two rows for a denser, alternating-direction marquee.
  const mid = Math.ceil(images.length / 2);
  const rowA = images.slice(0, mid);
  const rowB = images.slice(mid);

  return (
    <section className="py-12">
      <div className="flex justify-center mb-8">
        <h2 className="inline-block bg-black text-primary text-2xl sm:text-3xl font-black italic uppercase tracking-tight px-5 py-2 rounded-full border-2 border-white shadow-[3px_3px_0_0_#000] -rotate-1">
          Loved by our customers
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        <MarqueeRow images={rowA} direction="left" speedSeconds={Math.max(40, rowA.length * 4)} />
        {rowB.length > 0 && (
          <MarqueeRow images={rowB} direction="right" speedSeconds={Math.max(40, rowB.length * 4)} />
        )}
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .group [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}