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
            className="relative h-64 w-36 shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 sm:h-80 sm:w-44"
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
        <div className="flex justify-center text-sm text-neutral-400">
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
      <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
        Loved by our customers
      </h2>

      <div className="flex flex-col gap-4">
        <MarqueeRow images={rowA} direction="left" speedSeconds={Math.max(40, rowA.length * 4)} />
        {rowB.length > 0 && (
          <MarqueeRow images={rowB} direction="right" speedSeconds={Math.max(40, rowB.length * 4)} />
        )}
      </div>
{/*hi*/}
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