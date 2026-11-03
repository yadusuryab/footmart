import { site } from "@/lib/site-config";

// Inline icon. Zero icon-library bytes.
const check = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

interface ConfirmButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

// Green mesh pill. Squishes on press, springs back on release, sheen sweeps on hover.
// Transform and opacity only. Works in server or client components.
export function ConfirmButton({ children, onClick, disabled, className = "" }: ConfirmButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex h-12 w-full touch-manipulation select-none items-center justify-between overflow-hidden rounded-full p-1.5 pl-6 text-sm font-bold text-black transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] [-webkit-tap-highlight-color:transparent] before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-[150%] before:-skew-x-12 before:bg-white/40 before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:before:translate-x-[550%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:translate-y-0 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 disabled:before:hidden disabled:hover:translate-y-0 disabled:active:scale-100 motion-reduce:transition-none motion-reduce:before:hidden ${site.theme.mesh} ${className}`}
    >
      <span>{children}</span>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 motion-reduce:transition-none">
        {check}
      </span>
    </button>
  );
}