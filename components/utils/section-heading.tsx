import Link from "next/link";
import { site } from "@/lib/site-config";

interface SHeadingProps {
  title?: string;
  description?: string;
  linkHref?: string;
  nolink?: boolean;
  buttonText?: string;
  badge?: string;
  centered?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
} as const;

// Inline icons. Hoisted, zero icon-library bytes.
const arrow = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
    aria-hidden
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const chevron = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
    aria-hidden
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

// Server component: no hooks, no client JS.
export default function SHeading({
  title = site.copy.defaultHeading,
  description = "",
  linkHref = "/products",
  nolink = false,
  buttonText = site.copy.viewAll,
  badge,
  centered = true,
  size = "md",
}: SHeadingProps) {
  return (
    <div
      className={`flex w-full flex-col gap-3 ${
        centered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {badge && (
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold text-black ${site.theme.mesh}`}
        >
          {badge}
        </span>
      )}

      <h2 className={`${SIZE[size]} font-black italic leading-tight tracking-tighter`}>
        {title}
      </h2>

      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      )}

      {!nolink && (
        <Link
          href={linkHref}
          prefetch={false}
          className="group flex h-11 touch-manipulation items-center gap-3 rounded-full bg-black pl-5 pr-1.5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none"
        >
          {buttonText}
          <span className={`grid h-8 w-8 place-items-center rounded-full text-black ${site.theme.mesh}`}>
            {arrow}
          </span>
        </Link>
      )}

      {centered && (
        <span aria-hidden className={`h-1 w-16 rounded-full ${site.theme.mesh}`} />
      )}
    </div>
  );
}

// Compact inline version
export function InlineHeading({
  title,
  description,
  linkHref,
  buttonText = site.copy.viewAll,
}: Pick<SHeadingProps, "title" | "description" | "linkHref" | "buttonText">) {
  return (
    <div className="mb-6 flex items-end justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-black italic tracking-tighter">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      {linkHref && (
        <Link
          href={linkHref}
          prefetch={false}
          className="group flex shrink-0 items-center gap-1 rounded-full bg-black/10 px-4 py-2 text-sm font-bold transition-transform duration-200 active:scale-95 motion-reduce:transition-none"
        >
          {buttonText}
          {chevron}
        </Link>
      )}
    </div>
  );
}