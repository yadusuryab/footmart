"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProductCard2 from "@/components/product/product-image-card";
import Image from "next/image";

export interface Product {
  _id: string;
  productName: string;
  sizes: string[];
  buyOneGetOne: boolean;
  imageUrl?: string;
  price?: number;
  offerPrice?: number;
}

// Card-shuffle screen: shuffle first, then show "selected" and ask for the
// random pair's size, then redirect to checkout
const SHUFFLE_DURATION_MS = 2200;

/* ---------- Design tokens (same language as the header) ---------- */

const DISPLAY = "font-black italic tracking-tighter";

// Inline icons: zero icon-library bytes.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const CheckIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const ArrowIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Hoisted so React never remounts them between renders.
const PillCTA = ({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`group flex h-14 items-center justify-between rounded-full bg-black pl-6 pr-1.5 text-white transition-[transform,opacity] duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none ${className}`}
  >
    <span className={`text-base ${DISPLAY}`}>{children}</span>
    <span
      aria-hidden
      className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-black transition-transform duration-300 group-enabled:group-hover:translate-x-0.5 motion-reduce:transition-none"
    >
      <ArrowIcon />
    </span>
  </button>
);

const Thumbnail = ({
  product,
  alt,
  className = "h-12 w-12",
}: {
  product: Product;
  alt: string;
  className?: string;
}) => (
  <div
    className={`${className} shrink-0 overflow-hidden rounded-xl bg-muted`}
  >
    <Image
      src={product.imageUrl || "/placeholder-image.jpg"}
      alt={alt}
      width={56}
      height={56}
      sizes="56px"
      quality={40}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  </div>
);

export const useAddToCart = () => {
  const router = useRouter();
  const [isBogoModalOpen, setIsBogoModalOpen] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFreeProduct, setSelectedFreeProduct] =
    useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFreeProductSize, setSelectedFreeProductSize] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Random surprise pair: the size is picked on the shuffle screen, right after
  // the animation. We pick the style at packing.
  const [randomPairSize, setRandomPairSize] = useState<string | null>(null);

  const [bogoOffset, setBogoOffset] = useState<number>(0);
  const [bogoHasMore, setBogoHasMore] = useState<boolean>(true);
  const [bogoLoading, setBogoLoading] = useState<boolean>(false);
  const [allBogoProducts, setAllBogoProducts] = useState<Product[]>([]);

  // Card shuffle screen state (shown right before checkout)
  const [isSuccessAnimationOpen, setIsSuccessAnimationOpen] = useState(false);
  const [shuffleDone, setShuffleDone] = useState(false);

  useEffect(() => {
    if (!isSuccessAnimationOpen) {
      setShuffleDone(false);
      return;
    }
    const t = setTimeout(() => setShuffleDone(true), SHUFFLE_DURATION_MS);
    return () => clearTimeout(t);
  }, [isSuccessAnimationOpen]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setSelectedFreeProduct(null);
    setSelectedFreeProductSize(null);
    setRandomPairSize(null);
    setIsSizeModalOpen(true);
  }, []);

  const loadMoreBogoProducts = useCallback(async () => {
    if (bogoLoading || !bogoHasMore) return;

    try {
      setBogoLoading(true);
      const { getAllShoes } = await import("@/lib/vehicleQueries");
      const data: any = await getAllShoes(null, 12, bogoOffset);

      if (data?.length) {
        const newBogoProducts = data.filter(
          (item: Product) => item.buyOneGetOne,
        );
        setAllBogoProducts((prev) => [...prev, ...newBogoProducts]);
        setBogoHasMore(data.length === 12);
        setBogoOffset((prev) => prev + data.length);
      } else {
        setBogoHasMore(false);
      }
    } catch (err) {
      console.error("BOGO load error:", err);
      toast.error("Failed to load more products");
    } finally {
      setBogoLoading(false);
    }
  }, [bogoOffset, bogoLoading, bogoHasMore]);

  useEffect(() => {
    if (isBogoModalOpen && allBogoProducts.length === 0) {
      const timer = setTimeout(() => {
        loadMoreBogoProducts();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isBogoModalOpen, allBogoProducts.length, loadMoreBogoProducts]);

  const addToCart = useCallback(
    (
      item: Product,
      size: string,
      freeProduct?: Product | null,
      freeProductSize?: string | null,
    ) => {
      const cartItem = {
        ...item,
        selectedSize: size,
        freeProduct: freeProduct
          ? {
              ...freeProduct,
              selectedSize: freeProductSize,
            }
          : null,
        // Filled in on the shuffle screen, read by the checkout page.
        randomPairSize: null,
      };

      const updatedCart = [cartItem];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${item.productName} added to cart!`);
    },
    [],
  );

  const filteredBogoProducts = useCallback(
    (bogoProducts: Product[]) => {
      if (!searchQuery.trim()) return bogoProducts;
      return bogoProducts.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    },
    [searchQuery],
  );

  const handleFreeProductSelect = useCallback((bogoProduct: Product) => {
    setSelectedFreeProduct(bogoProduct);
    setSelectedFreeProductSize(null);
    setIsSizeModalOpen(true);
  }, []);

  // Shared: show the shuffle screen. It asks for the random pair's size once
  // the animation ends, then calls handleRandomSizeConfirm.
  const goToCheckoutWithAnimation = useCallback(() => {
    setRandomPairSize(null);
    setIsSuccessAnimationOpen(true);
  }, []);

  // Save the random pair size on the cart item, then go to checkout.
  const handleRandomSizeConfirm = useCallback(() => {
    if (!randomPairSize) return;
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(cart) && cart[0]) {
        cart[0].randomPairSize = randomPairSize;
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error("Could not save random pair size:", err);
    }
    setIsSuccessAnimationOpen(false);
    router.push("/checkout");
  }, [randomPairSize, router]);

  const completeBogoFlow = useCallback(() => {
    if (
      selectedFreeProduct &&
      selectedFreeProductSize &&
      selectedProduct &&
      selectedSize
    ) {
      addToCart(
        selectedProduct,
        selectedSize,
        selectedFreeProduct,
        selectedFreeProductSize,
      );
      setIsBogoModalOpen(false);
      setIsSizeModalOpen(false);
      goToCheckoutWithAnimation();
    }
  }, [
    selectedProduct,
    selectedSize,
    selectedFreeProduct,
    selectedFreeProductSize,
    addToCart,
    goToCheckoutWithAnimation,
  ]);

  const handleBogoScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight + 300 &&
        !bogoLoading &&
        bogoHasMore
      ) {
        loadMoreBogoProducts();
      }
    },
    [bogoLoading, bogoHasMore, loadMoreBogoProducts],
  );

  /* ---------- BOGO page ---------- */

  const renderBogoPage = useCallback(
    (initialBogoProducts: Product[]) => {
      if (!isBogoModalOpen || !selectedProduct) return null;

      const combinedBogoProducts = [...initialBogoProducts, ...allBogoProducts];
      const filteredProducts = filteredBogoProducts(combinedBogoProducts);

      return (
        // The page itself is the scroll container, so infinite scroll
        // listens here and there is no nested scrolling.
        <div
          onScroll={handleBogoScroll}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-background duration-500 animate-in fade-in slide-in-from-bottom-6"
        >
          <div className="mx-auto max-w-5xl px-4 pb-40 pt-6 sm:px-8">
            {/* Heading */}
            <h2
              className={`text-balance text-[clamp(2.25rem,8vw,4.5rem)] leading-[1] ${DISPLAY}`}
            >
              Choose your
              <br />
              <span className="rounded-md bg-black px-1.5 py-0.5 text-primary">
                free
              </span>{" "}
              pair.
            </h2>

            {/* First pair */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-muted p-2.5">
              <Thumbnail
                product={selectedProduct}
                alt="Your first pair"
                className="h-14 w-14"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold tracking-tight">
                  {selectedProduct.productName}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  1st pair, size {selectedSize}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-black px-2.5 py-1 text-xs font-bold text-primary">
                <CheckIcon className="h-3 w-3" /> Locked
              </span>
            </div>

            {/* Status (height reserved so the grid never jumps) */}
            <div className="mb-4 mt-4 h-5" aria-live="polite">
              {selectedFreeProduct && !selectedFreeProductSize && (
                <p className="text-sm font-bold duration-300 animate-in fade-in slide-in-from-left-2">
                  Select a size for your 2nd pair
                </p>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {filteredProducts.length === 0 ? (
                <p
                  className={`col-span-full py-16 text-center text-lg text-muted-foreground ${DISPLAY}`}
                >
                  No products found
                </p>
              ) : (
                filteredProducts.map((bogoProduct) => {
                  const picked = selectedFreeProduct?._id === bogoProduct._id;
                  return (
                    <div
                      key={bogoProduct._id}
                      // Off-screen cards skip layout and paint work.
                      className="w-full [contain-intrinsic-size:auto_280px] [content-visibility:auto]"
                    >
                      <div
                        className={`relative rounded-2xl outline outline-[3px] outline-offset-2 transition-[outline-color,transform] duration-300 active:scale-[0.98] motion-reduce:transition-none ${
                          picked ? "outline-primary" : "outline-transparent"
                        }`}
                      >
                        <ProductCard2
                          product={bogoProduct}
                          className="w-full"
                          noLink={true}
                          onClick={() => handleFreeProductSelect(bogoProduct)}
                        />
                        {picked && (
                          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-primary duration-300 animate-in zoom-in-50">
                            <CheckIcon />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {bogoLoading && (
                <div className="col-span-full py-3" aria-hidden>
                  <div className="h-1 w-full animate-pulse rounded-full bg-black" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="fixed bottom-0 left-0 w-full rounded-t-3xl bg-background px-4 pt-4 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)]"
            style={{
              paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {selectedFreeProduct ? (
                  <>
                    <Thumbnail
                      product={selectedFreeProduct}
                      alt="Your free pair"
                      className="h-12 w-12 !rounded-full"
                    />
                    <div className="min-w-0 flex-1">
                      {selectedFreeProductSize ? (
                        <>
                          <p className="text-sm font-bold tracking-tight">
                            Size {selectedFreeProductSize}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">
                            Ready
                          </p>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleFreeProductSelect(selectedFreeProduct)
                          }
                          className="text-sm font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                          Select size
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-muted-foreground">
                    Select your 2nd pair (free)
                  </p>
                )}
              </div>

              <PillCTA
                onClick={completeBogoFlow}
                disabled={!selectedFreeProduct || !selectedFreeProductSize}
                className="min-w-[150px]"
              >
                {selectedFreeProductSize ? "Checkout" : "Pick a size"}
              </PillCTA>
            </div>
          </div>
        </div>
      );
    },
    [
      isBogoModalOpen,
      selectedProduct,
      selectedSize,
      selectedFreeProduct,
      selectedFreeProductSize,
      filteredBogoProducts,
      handleFreeProductSelect,
      completeBogoFlow,
      allBogoProducts,
      bogoLoading,
      handleBogoScroll,
    ],
  );

  /* ---------- Size modal ---------- */

  const renderSizeModal = useCallback(
    (bogoProducts: Product[]) => {
      const isSelectingFreeProduct = !!selectedFreeProduct;
      const currentProduct = isSelectingFreeProduct
        ? selectedFreeProduct
        : selectedProduct;
      const currentSize = isSelectingFreeProduct
        ? selectedFreeProductSize
        : selectedSize;

      if (!currentProduct) return null;

      const goesToBogo = !isSelectingFreeProduct && !!selectedProduct?.buyOneGetOne;

      return (
        <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
          <DialogContent className="max-h-[90vh] max-w-[340px] gap-0 overflow-y-auto rounded-3xl border-0 bg-background p-4">
            <div className="mb-4 overflow-hidden rounded-2xl">
              <ProductCard2 product={currentProduct} noLink={true} />
            </div>

            <DialogTitle
              className={`mb-1 line-clamp-1 text-2xl leading-none ${DISPLAY}`}
            >
              {currentProduct.productName}
            </DialogTitle>
            <p className="mb-4 text-sm font-semibold text-muted-foreground">
              Select your size
            </p>

            <div
              role="group"
              aria-label="Size"
              className="mb-6 flex flex-wrap gap-2"
            >
              {currentProduct.sizes?.map((size: string) => {
                const active = currentSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      if (isSelectingFreeProduct) {
                        setSelectedFreeProductSize(size);
                      } else {
                        setSelectedSize(size);
                      }
                    }}
                    className={`h-11 min-w-[52px] rounded-full px-4 text-sm font-bold tracking-tight transition-[transform,background-color,color] duration-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none ${
                      active
                        ? "bg-black text-white"
                        : "bg-muted text-foreground hover:bg-muted/70"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <PillCTA
              disabled={!currentSize}
              className="w-full"
              onClick={() => {
                if (!currentSize) {
                  toast.error("Please select a size");
                  return;
                }

                if (isSelectingFreeProduct) {
                  setIsSizeModalOpen(false);
                  completeBogoFlow();
                } else {
                  if (selectedProduct?.buyOneGetOne) {
                    setIsBogoModalOpen(true);
                    setIsSizeModalOpen(false);
                  } else {
                    addToCart(selectedProduct!, currentSize);
                    setIsSizeModalOpen(false);
                    goToCheckoutWithAnimation();
                  }
                }
              }}
            >
              {goesToBogo ? "Confirm size" : "Confirm & checkout"}
            </PillCTA>
          </DialogContent>
        </Dialog>
      );
    },
    [
      isSizeModalOpen,
      selectedFreeProduct,
      selectedProduct,
      selectedFreeProductSize,
      selectedSize,
      completeBogoFlow,
      addToCart,
      goToCheckoutWithAnimation,
    ],
  );

  /* ---------- Shuffle screen (full-screen black, like the menu) ---------- */

  const renderSuccessAnimation = useCallback(() => {
    if (!isSuccessAnimationOpen) return null;

    // The random pair is the 3rd pair on a BOGO order, otherwise the 2nd.
    const ordinal = selectedFreeProduct ? "3rd" : "2nd";
    const sizeOptions = selectedProduct?.sizes ?? [];

    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-black px-6 py-10 text-white duration-300 animate-in fade-in"
      >
        <style>{`
          @keyframes rp-a { 0%,100% { transform: translateX(0) rotate(-8deg); z-index: 1; } 50% { transform: translateX(46px) rotate(6deg); z-index: 3; } }
          @keyframes rp-b { 0%,100% { transform: translateX(0) rotate(0deg); z-index: 2; } 50% { transform: translateX(-46px) rotate(-6deg); z-index: 1; } }
          @keyframes rp-c { 0%,100% { transform: translateX(0) rotate(8deg); z-index: 3; } 50% { transform: translateX(0) rotate(0deg) translateY(-14px); z-index: 2; } }
          @keyframes rp-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          @keyframes rp-dots { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
          @media (prefers-reduced-motion: reduce) { .rp-anim, .rp-anim * { animation: none !important; } }
        `}</style>

        {/* my-auto centers the content and still lets tall content scroll */}
        <div className="rp-anim my-auto flex w-full max-w-sm flex-col items-center">
          {!shuffleDone ? (
            <>
              <div className="relative h-40 w-40" aria-hidden>
                {(["a", "b", "c"] as const).map((k) => (
                  <div
                    key={k}
                    className={`absolute inset-0 flex items-center justify-center rounded-3xl bg-primary text-7xl text-black shadow-xl will-change-transform ${DISPLAY}`}
                    style={{ animation: `rp-${k} 0.9s ease-in-out infinite` }}
                  >
                    ?
                  </div>
                ))}
              </div>

              <h2
                className={`mt-10 text-center text-[clamp(2rem,8vw,3.5rem)] leading-[1.05] ${DISPLAY}`}
              >
                Picking a random pair
                <span
                  className="inline-block"
                  style={{ animation: "rp-dots 1s ease-in-out infinite" }}
                >
                  ...
                </span>
              </h2>

              <div className="mt-8 h-1 w-52 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full w-full origin-left rounded-full bg-primary will-change-transform"
                  style={{
                    animation: `rp-bar ${SHUFFLE_DURATION_MS}ms cubic-bezier(0.76,0,0.24,1) forwards`,
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center duration-500 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-black shadow-xl duration-500 animate-in zoom-in-75 fade-in">
                <CheckIcon className="h-10 w-10" />
              </div>

              <h2
                className={`mt-6 text-center text-[clamp(1.75rem,7vw,2.75rem)] leading-[1.05] ${DISPLAY}`}
              >
                Random pair
                <br />
                <span className="rounded-md bg-primary px-1.5 py-0.5 text-black">
                  selected.
                </span>
              </h2>

              <p className="mt-4 text-center text-sm font-semibold text-white/60">
                Pick a size for your {ordinal} pair. 
              </p>

              {/* Size pick */}
              <div
                role="group"
                aria-label={`Size for your ${ordinal} pair`}
                className="mt-6 flex flex-wrap justify-center gap-2"
              >
                {sizeOptions.map((size) => {
                  const active = randomPairSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setRandomPairSize(size)}
                      className={`h-11 min-w-[52px] rounded-full px-4 text-sm font-bold tracking-tight transition-[transform,background-color,color] duration-200 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
                        active
                          ? "bg-primary text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Black pill on a black screen would vanish, so this one is primary */}
              <button
                type="button"
                onClick={handleRandomSizeConfirm}
                disabled={!randomPairSize}
                className="group mt-8 flex h-14 w-full items-center justify-between rounded-full bg-primary pl-6 pr-1.5 text-black transition-[transform,opacity] duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
              >
                <span className={`text-base ${DISPLAY}`}>
                  {randomPairSize ? "Go to checkout" : "Pick a size"}
                </span>
                <span
                  aria-hidden
                  className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-primary transition-transform duration-300 group-enabled:group-hover:translate-x-0.5 motion-reduce:transition-none"
                >
                  <ArrowIcon />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }, [
    isSuccessAnimationOpen,
    shuffleDone,
    selectedProduct,
    selectedFreeProduct,
    randomPairSize,
    handleRandomSizeConfirm,
  ]);

  return {
    handleProductClick,
    renderBogoPage,
    renderSizeModal,
    renderSuccessAnimation,
    setSearchQuery,
  };
};