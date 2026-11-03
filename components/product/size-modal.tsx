"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { site, formatPrice } from "@/lib/site-config";
import { ConfirmButton } from "./confirm-button";

interface SizeModalProduct {
  productName: string;
  imageUrl?: string;
  price?: number;
  offerPrice?: number;
  sizes?: string[];
}

interface SizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: SizeModalProduct;
  size: string | null;
  onSelect: (size: string) => void;
  confirmLabel: string;
  onConfirm: () => void;
}

const { offer, products } = site;

// Presentational only. Your flow logic stays in the hook.
export function SizeModal({
  open,
  onOpenChange,
  product,
  size,
  onSelect,
  confirmLabel,
  onConfirm,
}: SizeModalProps) {
  const price = product.offerPrice ?? product.price;
  const sizes = product.sizes ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Centered by Radix. Border and shadow removed for the flat style. */}
      <DialogContent className="max-h-[90vh] max-w-[320px] gap-4 overflow-y-auto rounded-3xl border-0 p-5 shadow-none">
        <DialogTitle className="sr-only">{offer.sizeTitle}</DialogTitle>

        <div className="flex flex-col items-center gap-3">
          <div className="relative aspect-square w-40 overflow-hidden rounded-2xl bg-primary/10">
            <Image
              src={product.imageUrl || products.placeholder}
              alt={product.productName}
              fill
              sizes="160px"
              quality={50}
              className="object-cover"
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-bold leading-tight">{product.productName}</p>
            {price != null && (
              <p className="mt-0.5 text-sm font-semibold text-muted-foreground">
                {formatPrice(price)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/50">
            {offer.sizeTitle}
          </span>

          {sizes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sizes available</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => onSelect(s)}
                  className={`h-11 min-w-[56px] touch-manipulation rounded-full px-4 text-sm font-bold transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] [-webkit-tap-highlight-color:transparent] active:scale-90 motion-reduce:transition-none ${
                    size === s ? "bg-black text-white" : "bg-black/10 hover:bg-black/15"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <ConfirmButton disabled={!size} onClick={onConfirm}>
          {confirmLabel}
        </ConfirmButton>
      </DialogContent>
    </Dialog>
  );
}