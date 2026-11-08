"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { INDIAN_STATES } from "@/lib/indian-states";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function StateSelect({
  id = "state",
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (state: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? INDIAN_STATES.filter((s) => s.toLowerCase().includes(q))
      : INDIAN_STATES;
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const select = (state: string) => {
    onChange(state);
    close();
  };

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => (open ? close() : setOpen(true))}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className={`truncate ${value ? "" : "text-muted-foreground"}`}>
          {value || "Select your state"}
        </span>
        <svg {...iconProps} className="ml-2 h-4 w-4 shrink-0 opacity-50">
          <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-background shadow-lg">
          <div className="flex items-center gap-2 border-b px-3">
            <svg {...iconProps} className="h-4 w-4 shrink-0 opacity-50">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (filtered[0]) select(filtered[0]);
                }
              }}
              placeholder="Search state"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <ul role="listbox" className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No state found
              </li>
            ) : (
              filtered.map((state) => {
                const selected = state === value;
                return (
                  <li key={state} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => select(state)}
                      className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm hover:bg-muted ${
                        selected ? "bg-muted font-medium" : ""
                      }`}
                    >
                      <span className="truncate">{state}</span>
                      {selected && (
                        <svg {...iconProps} className="h-4 w-4 shrink-0">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}