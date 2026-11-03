"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site-config";

interface ShopVideoProps {
  src?: string;
  poster?: string;
  onShopNow?: () => void;
}

const { video } = site;

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// Inline icons. Hoisted, so React never re-renders them. Zero icon-library bytes.
const Svg = ({
  children,
  className = "h-5 w-5",
  fill,
}: {
  children: React.ReactNode;
  className?: string;
  fill?: boolean;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

const playCard = (
  <Svg fill className="ml-0.5 h-5 w-5">
    <path d="M7 4.5v15l13-7.5z" />
  </Svg>
);
const playBig = (
  <Svg fill className="ml-1 h-7 w-7">
    <path d="M7 4.5v15l13-7.5z" />
  </Svg>
);
const playSmall = (
  <Svg fill className="ml-0.5 h-5 w-5">
    <path d="M7 4.5v15l13-7.5z" />
  </Svg>
);
const pauseIcon = (
  <Svg fill>
    <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
  </Svg>
);
const closeIcon = (
  <Svg>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
const volumeOn = (
  <Svg>
    <path d="M11 5L6 9H3v6h3l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </Svg>
);
const volumeOff = (
  <Svg>
    <path d="M11 5L6 9H3v6h3l5 4z" />
    <path d="M16 9l5 6M21 9l-5 6" />
  </Svg>
);
const bagIcon = (
  <Svg className="h-4 w-4">
    <path d="M6 7h12l1 13H5z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </Svg>
);

// Abstract mesh: lime, emerald and cyan blobs. Pure CSS, matches the green brand.
const mesh = site.theme.mesh;

const springEase = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";
const roundBtn =
  "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/60 text-white transition-transform duration-200 hover:bg-black/80 active:scale-90 motion-reduce:transition-none";

export function ShopVideo({
  src = video.src,
  poster = video.poster,
  onShopNow,
}: ShopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLSpanElement>(null);
  const durRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const router = useRouter();
  const [open, setOpen] = useState(false); // mounted
  const [shown, setShown] = useState(false); // animated in
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const closeModal = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setShown(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpen(false);
      setPlaying(false);
      triggerRef.current?.focus();
    }, 250);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  // Enter animation, scroll lock, focus, keys. Only while open.
  useEffect(() => {
    if (!open) return;

    const raf = requestAnimationFrame(() => setShown(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === " " && document.activeElement?.tagName !== "BUTTON") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeModal, togglePlay]);

  // The tap that opened the modal allows sound. Fall back to muted if blocked.
  useEffect(() => {
    const v = videoRef.current;
    if (!open || !v) return;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, [open]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  // Progress is written straight to the DOM. No re-render on every tick.
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (barRef.current) barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    if (curRef.current) curRef.current.textContent = formatTime(v.currentTime);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const handleShopNow = () => {
    closeModal();
    if (onShopNow) onShopNow();
    else if (video.shopHref) router.push(video.shopHref);
  };

  return (
    <>
      {/* ================= CARD =================
          No poster, no video request. Zero media bytes until the tap. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={video.watchLabel}
        className="group flex w-full touch-manipulation select-none flex-col gap-3 text-left [-webkit-tap-highlight-color:transparent] focus-visible:outline-none"
      >
        <span className={`flex items-stretch gap-3 rounded-3xl p-4 text-white ${site.theme.card}`}>
          <span className="flex min-w-0 flex-1 flex-col justify-center gap-3">
            <span className="w-fit rounded-full bg-black/30 px-3 py-1.5 text-xs font-bold">
              {video.badge}
            </span>

            <span className="block text-xl font-black italic leading-[1.1] tracking-tighter">
              {video.title}
            </span>

            <span className="block text-xs font-semibold leading-snug text-white/75">
              {video.text}
            </span>

            <span className="flex flex-wrap gap-1.5">
              {video.highlights.map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/90"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  {label}
                </span>
              ))}
            </span>
          </span>

          {/* Thumbnail: lazy, resized by next/image. Loads nothing until near the viewport. */}
          <span className="relative h-[190px] w-[112px] shrink-0 overflow-hidden rounded-2xl bg-black/30">
            <Image
              src={poster}
              alt=""
              fill
              sizes="112px"
              quality={60}
              className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
            />
            <span className="absolute inset-0 bg-black/20" />
            <span className="absolute inset-0 grid place-items-center">
              <span className={`grid h-11 w-11 place-items-center rounded-full text-black ${mesh}`}>
                {playCard}
              </span>
            </span>
          </span>
        </span>

        {/* Detached CTA: squishes on press, springs back on release. */}
        <span
          className={`relative flex items-center justify-between overflow-hidden rounded-full ${mesh} p-1.5 pl-6 text-black transition-transform duration-200 ${springEase} before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-[150%] before:-skew-x-12 before:bg-white/40 before:transition-transform before:duration-700 group-hover:-translate-y-0.5 group-hover:before:translate-x-[550%] group-active:translate-y-0 group-active:scale-[0.96] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-black motion-reduce:transition-none motion-reduce:before:hidden`}
        >
          <span className="text-base font-bold transition-transform duration-200 group-active:translate-x-1 motion-reduce:transition-none">
            {video.cta}
          </span>
          <span
            className={`relative grid h-11 w-11 place-items-center rounded-full bg-black text-white transition-transform duration-200 ${springEase} group-active:scale-90 motion-reduce:transition-none`}
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-black opacity-25 group-hover:animate-none group-active:animate-none motion-reduce:animate-none"
            />
            {playCard}
          </span>
        </span>
      </button>

      {/* ================= MODAL =================
          Mounted only when open, so the video is never fetched before a tap. */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={video.label}
          onClick={closeModal}
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-3 transition-opacity duration-200 motion-reduce:transition-none ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative h-[88dvh] max-h-[850px] w-full max-w-[420px] overflow-hidden rounded-3xl bg-black transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
              shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"
            }`}
          >
            <video
              ref={videoRef}
              src={src}
              loop
              playsInline
              preload="metadata"
              onClick={togglePlay}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedMetadata={(e) => {
                if (durRef.current) durRef.current.textContent = formatTime(e.currentTarget.duration);
              }}
              onTimeUpdate={onTimeUpdate}
              className="h-full w-full cursor-pointer object-cover"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-2 text-xs font-bold text-white">
              {video.label}
            </span>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeModal}
              aria-label="Close video"
              className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white transition-transform duration-200 hover:bg-black/80 active:scale-90 motion-reduce:transition-none"
            >
              {closeIcon}
            </button>

            {/* Paused indicator */}
            <div
              className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-200 motion-reduce:transition-none ${
                playing ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className={`grid h-16 w-16 place-items-center rounded-full text-black ${mesh}`}>
                {playBig}
              </span>
            </div>

            {/* Only shown if the browser blocked sound */}
            {muted && (
              <button
                type="button"
                onClick={toggleMute}
                className={`absolute left-1/2 top-16 -translate-x-1/2 rounded-full px-4 py-2 text-xs font-bold text-black active:scale-95 ${mesh}`}
              >
                {video.soundHint}
              </button>
            )}

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-white/85">
                <span ref={curRef} className="w-8 tabular-nums">
                  0:00
                </span>
                <div onClick={seek} className="relative h-5 flex-1 cursor-pointer">
                  <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                    <div
                      ref={barRef}
                      className={`h-full origin-left scale-x-0 ${mesh} transition-transform duration-300 ease-linear motion-reduce:transition-none`}
                    />
                  </div>
                </div>
                <span ref={durRef} className="w-8 text-right tabular-nums">
                  0:00
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Pause video" : "Play video"}
                  className={roundBtn}
                >
                  {playing ? pauseIcon : playSmall}
                </button>

                <button
                  type="button"
                  onClick={handleShopNow}
                  className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full ${mesh} text-sm font-bold text-black transition-transform duration-200 ${springEase} active:scale-[0.96] motion-reduce:transition-none`}
                >
                  {bagIcon}
                  {video.shopLabel}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                  className={roundBtn}
                >
                  {muted ? volumeOff : volumeOn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}