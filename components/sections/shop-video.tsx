// components/sections/shop-video.tsx
"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX, CheckCircle, Shield, Star } from "lucide-react";

export function ShopVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <section className="flex flex-col items-center py-12 px-4">
      <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-[2rem] overflow-hidden bg-black border-4 border-black shadow-[6px_6px_0_0_theme(colors.primary.DEFAULT)]">
        <video
          ref={videoRef}
          src="/video.mp4"
          autoPlay
          loop
          muted={muted}
          playsInline
          className="h-full w-full object-cover"
        />

        {/* Trust Badge - Top Left */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black text-primary border-2 border-white px-3 py-1.5 text-xs font-black uppercase tracking-wide shadow-[2px_2px_0_0_#000]">
          <Shield className="h-3.5 w-3.5" />
          <span>Verified</span>
        </div>

        {/* Trust Badge - Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-primary text-black border-2 border-black px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_0_#000] -rotate-3">
          <Star className="h-3.5 w-3.5 fill-black" />
          <span>4.9</span>
        </div>

        {/* About Overlay - Bottom */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="rounded-xl bg-primary border-2 border-black p-3 text-black shadow-[3px_3px_0_0_#000]">
            <p className="text-xs font-bold leading-relaxed">
              Premium quality • Sustainable materials • All India delivery
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-[10px] font-bold text-black/70">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Ethically made
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Free shipping
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black text-primary border-2 border-white shadow-[2px_2px_0_0_#000] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </section>
  );
}