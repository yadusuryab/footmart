"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { site } from "@/lib/site-config";
import { client } from "@/sanity/lib/client"; // adjust path to your Sanity client

interface CartItem {
  _id: string;
  productName: string;
  selectedSize: string;
  price: number;
  image?: string;
  imageUrl?: string;
  images?: Array<{ asset: { url: string } }>;
  buyOneGetOne?: boolean;
  freeProduct?: CartItem;
}

interface SiteSettings {
  freeSocksOffer: boolean;
  shoeCleanerAddon: boolean;
}

type CheckoutStep = "payment" | "details";

const getProductImageUrl = (product: any): string => {
  if (!product) return "/placeholder-image.jpg";
  const url =
    product.image ||
    product.imageUrl ||
    product.images?.[0]?.asset?.url ||
    product.images?.[0]?.url ||
    "";
  if (!url) return "/placeholder-image.jpg";
  // Tiny thumbnails only: this page shows 64px images.
  if (url.includes("cloudinary.com"))
    return url.replace("/upload/", "/upload/w_160,h_160,c_fill,q_50,f_auto/");
  return url;
};

const BASE_PRICE = 1499;
const ONLINE_SHIPPING = 150;
const COD_CHARGE = 300;
const SHOE_CLEANER_PRICE = 80;
const SOCKS_PRICE = 99;

// freeSocksOffer toggles the Flame Socks add-on (visibility only).
const SETTINGS_QUERY = `*[_type == "settings"][0]{ freeSocksOffer, shoeCleanerAddon }`;

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* ---------- Design tokens (same language as the header) ---------- */

const DISPLAY = "font-black italic tracking-tighter";
const H1 = `text-[clamp(2.25rem,9vw,3.5rem)] leading-[1] ${DISPLAY}`;
const CHIP = "rounded-md bg-black px-1.5 py-0.5 text-primary";
const SELECTABLE =
  "relative block cursor-pointer rounded-2xl p-4 transition-[background-color,box-shadow,transform] duration-300 active:scale-[0.99] motion-reduce:transition-none";
const FOCUS_RING =
  "pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black";

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

/* ---------- UI atoms (hoisted, so they never remount) ---------- */

const PILL =
  "group flex h-14 items-center justify-between rounded-full bg-black pl-6 pr-1.5 text-white transition-[transform,opacity] duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none";

const PillContent = ({ children }: { children: React.ReactNode }) => (
  <>
    <span className={`text-base ${DISPLAY}`}>{children}</span>
    <span
      aria-hidden
      className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-black transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
    >
      <ArrowIcon />
    </span>
  </>
);

const PillCTA = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button type="button" onClick={onClick} className={`${PILL} ${className}`}>
    <PillContent>{children}</PillContent>
  </button>
);

const StepBar = ({ step }: { step: CheckoutStep }) => {
  const idx = step === "payment" ? 0 : 1;
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1.5" aria-hidden>
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
              i <= idx ? "bg-black" : "bg-black/10"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-muted-foreground">
        Step {idx + 1} of 2
      </span>
    </div>
  );
};

const PairRow = ({
  product,
  label,
  free,
  random,
}: {
  product?: CartItem;
  label: string;
  free?: boolean;
  random?: boolean;
}) => (
  <div className="flex items-center gap-3 rounded-2xl bg-muted p-2.5">
    {random ? (
      <div
        aria-hidden
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary text-3xl text-black ${DISPLAY}`}
      >
        ?
      </div>
    ) : (
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
        <Image
          src={getProductImageUrl(product)}
          alt={product?.productName || "Product"}
          width={64}
          height={64}
          sizes="64px"
          quality={50}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
    )}
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold tracking-tight">
        {random ? "Random surprise pair" : product?.productName || "Product"}
      </p>
      <p className="text-xs text-muted-foreground">
        {random
          ? "Picked by us at packing"
          : `Size ${product?.selectedSize || "N/A"}`}
      </p>
    </div>
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
        free ? "bg-primary text-black" : "bg-black text-primary"
      }`}
    >
      {label}
    </span>
  </div>
);

const PayOption = ({
  id,
  checked,
  onSelect,
  title,
  tag,
  strongTag,
  children,
}: {
  id: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  tag: string;
  strongTag?: boolean;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={id}
    className={`${SELECTABLE} ${
      checked
        ? "bg-primary shadow-[inset_0_0_0_2px_#000]"
        : "bg-muted hover:bg-muted/70"
    }`}
  >
    <input
      id={id}
      type="radio"
      name="payment"
      checked={checked}
      onChange={onSelect}
      className="peer sr-only"
    />
    <span className={FOCUS_RING} />
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-black transition-colors motion-reduce:transition-none ${
          checked ? "bg-black text-primary" : ""
        }`}
      >
        {checked && <CheckIcon className="h-3 w-3" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold tracking-tight">{title}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              strongTag ? "bg-black text-primary" : "bg-black/10 text-black"
            }`}
          >
            {tag}
          </span>
        </div>
        <div className="mt-1.5 space-y-0.5 text-xs text-black/70">
          {children}
        </div>
      </div>
    </div>
  </label>
);

const AddOn = ({
  checked,
  onToggle,
  title,
  desc,
  price,
  was,
  tag,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  desc: string;
  price: string;
  was?: string;
  tag?: string;
}) => (
  <label
    className={`${SELECTABLE} ${
      checked
        ? "bg-primary shadow-[inset_0_0_0_2px_#000]"
        : "bg-muted hover:bg-muted/70"
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className="peer sr-only"
    />
    <span className={FOCUS_RING} />
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-black transition-colors motion-reduce:transition-none ${
          checked ? "bg-black text-primary" : ""
        }`}
      >
        {checked && <CheckIcon className="h-3 w-3" />}
      </span>
      <div className="min-w-0 flex-1">
        {tag && (
          <span className="mb-1 inline-block rounded-full bg-black px-2 py-0.5 text-[11px] font-bold text-primary">
            {tag}
          </span>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold tracking-tight">{title}</span>
          <span className="flex items-center gap-1.5">
            {was && (
              <span className="text-xs text-black/50 line-through">{was}</span>
            )}
            <span className="rounded-full bg-black px-2 py-0.5 text-xs font-bold text-primary">
              {price}
            </span>
          </span>
        </div>
        <p className="mt-1 text-xs text-black/70">{desc}</p>
      </div>
    </div>
  </label>
);

const Row = ({
  label,
  value,
  muted,
  indent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  indent?: boolean;
}) => (
  <div
    className={`flex justify-between text-sm ${indent ? "pl-4" : ""} ${
      muted ? "text-muted-foreground" : "font-medium"
    }`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const isMobile = (raw: string) => {
  const d = raw.replace(/\D/g, "");
  const ten = d.length === 12 && d.startsWith("91") ? d.slice(2) : d;
  return /^[6-9]\d{9}$/.test(ten);
};

/* ---------- Page ---------- */

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"online" | "cod">(
    "online",
  );
  const [addShoeCleaner, setAddShoeCleaner] = useState(false);
  const [addSocks, setAddSocks] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [settings, setSettings] = useState<SiteSettings>({
    freeSocksOffer: false,
    shoeCleanerAddon: false,
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    contact1: "",
    contact2: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
    instagramId: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch {
      setCartItems([]);
    }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    let active = true;
    client
      .fetch<SiteSettings | null>(SETTINGS_QUERY)
      .then((data) => {
        if (!active) return;
        setSettings({
          freeSocksOffer: !!data?.freeSocksOffer,
          shoeCleanerAddon: !!data?.shoeCleanerAddon,
        });
      })
      .catch(() => {
        if (!active) return;
        setSettings({ freeSocksOffer: false, shoeCleanerAddon: false });
      })
      .finally(() => {
        if (active) setSettingsLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // If an add-on gets disabled after the user selected it, drop the selection.
  useEffect(() => {
    if (settingsLoaded && !settings.shoeCleanerAddon && addShoeCleaner) {
      setAddShoeCleaner(false);
    }
  }, [settingsLoaded, settings.shoeCleanerAddon, addShoeCleaner]);

  useEffect(() => {
    if (settingsLoaded && !settings.freeSocksOffer && addSocks) {
      setAddSocks(false);
    }
  }, [settingsLoaded, settings.freeSocksOffer, addSocks]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Bring validation errors into view (the CTA lives in the bottom bar).
  useEffect(() => {
    if (formErrors.length) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [formErrors]);

  const mainProduct = cartItems[0];
  const freeProduct = mainProduct?.freeProduct;
  // Every order gets a free pair: either the cart's own BOGO freeProduct, or a
  // randomly picked pair decided at fulfillment time (no product to show yet).
  const hasRandomFreePair = !freeProduct;
  const pair1Extra = Math.max(
    0,
    (mainProduct?.price || BASE_PRICE) - BASE_PRICE,
  );
  const pair2Extra = Math.max(
    0,
    (freeProduct?.price || BASE_PRICE) - BASE_PRICE,
  );
  const subtotal = BASE_PRICE + pair1Extra + pair2Extra;
  const shippingCharge =
    shippingMethod === "online" ? ONLINE_SHIPPING : COD_CHARGE;
  const cleanerCharge =
    settings.shoeCleanerAddon && addShoeCleaner ? SHOE_CLEANER_PRICE : 0;
  const socksCharge = settings.freeSocksOffer && addSocks ? SOCKS_PRICE : 0;
  const totalAmount = subtotal + shippingCharge + cleanerCharge + socksCharge;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    if (formErrors.length > 0) setFormErrors([]);
  };

  const validate = () => {
    const d = customerDetails;
    const errors: string[] = [];
    if (!d.name.trim()) errors.push("Enter your name");
    if (!isMobile(d.contact1)) errors.push("Enter a valid 10-digit mobile number");
    if (!d.address.trim()) errors.push("Enter your address");
    if (!d.district.trim()) errors.push("Enter your district");
    if (!d.state.trim()) errors.push("Enter your state");
    if (!/^\d{6}$/.test(d.pincode.trim())) errors.push("Enter a 6-digit pincode");
    return errors;
  };

  const handleWhatsAppOrder = () => {
    const errors = validate();
    if (errors.length) {
      setFormErrors(errors);
      return;
    }

    try {
      const productMessages = cartItems
        .map((item, idx) => {
          let msg = `*PAIR ${idx + 1}*\nProduct: Footmart\nSize: ${item.selectedSize || "N/A"}\nLink: https://shopfootmart.in/p/${item._id}`;
          if (item.buyOneGetOne && item.freeProduct) {
            msg += `\n\n*PAIR ${idx + 2}*\nProduct: Footmart\nSize: ${item.freeProduct.selectedSize || "N/A"}\nLink: https://shopfootmart.in/p/${item.freeProduct._id}`;
          }
          return msg;
        })
        .join("\n\n");

      const freePairLine = hasRandomFreePair
        ? `\n\n*PAIR 2 (FREE)*\n🎁 Random Surprise Pair — picked by us at packing`
        : "";

      const msg =
        `*2 PAIR SHOES ORDER*\n\n${productMessages}${freePairLine}\n\n*CUSTOMER DETAILS*\nName: ${customerDetails.name}\nInstagram: ${customerDetails.instagramId}\nAddress: ${customerDetails.address}\nDistrict: ${customerDetails.district}\nState: ${customerDetails.state}\nPincode: ${customerDetails.pincode}\nLandmark: ${customerDetails.landmark || "N/A"}\nContact No.1: ${customerDetails.contact1}\nContact No.2: ${customerDetails.contact2 || "N/A"}\n\n*ORDER SUMMARY*\nBase Price: ₹${BASE_PRICE}\nPair 1 Extra: ₹${pair1Extra}\nPair 2 Extra: ₹${pair2Extra}\n${hasRandomFreePair ? "🎁 FREE Random Pair Included\n" : ""}${cleanerCharge > 0 ? `Add-on: Shoe Cleaner (+₹${SHOE_CLEANER_PRICE})\n` : ""}${socksCharge > 0 ? `Add-on: Flame Socks (+₹${SOCKS_PRICE})\n` : ""}Shipping: ${shippingMethod === "online" ? `₹${ONLINE_SHIPPING} (Online Payment)` : `₹${COD_CHARGE} (Cash on Delivery)`}\n*GRAND TOTAL: ₹${totalAmount}*`.trim();

      const url = `https://wa.me/${site.phone}?text=${encodeURIComponent(msg)}`;

      // Opened straight from the tap. A delayed window.open gets blocked as a
      // popup on iOS Safari. If it is blocked anyway, the sent screen has a link.
      window.open(url, "_blank", "noopener,noreferrer");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      setWaUrl(url);
    } catch {
      setFormErrors(["Could not create your order. Try again."]);
    }
  };

  /* ----- Loading ----- */
  if (!cartLoaded) {
    return (
      <main className="mx-auto min-h-screen max-w-xl px-4 pt-4" aria-busy>
        <div className="h-1 animate-pulse rounded-full bg-muted" />
        <div className="mt-6 h-12 w-2/3 animate-pulse rounded-xl bg-muted" />
        <div className="mt-6 h-20 animate-pulse rounded-2xl bg-muted" />
        <div className="mt-3 h-20 animate-pulse rounded-2xl bg-muted" />
      </main>
    );
  }

  /* ----- Order sent ----- */
  if (waUrl) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-4 duration-500 animate-in fade-in slide-in-from-bottom-3">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-black">
          <CheckIcon className="h-8 w-8" />
        </span>
        <h1 className={H1}>
          Order{" "}
          <span className={CHIP}>sent.</span>
        </h1>
        <p className="mb-8 mt-4 max-w-sm text-muted-foreground">
          Send the pre-filled message in WhatsApp to confirm your order. If it
          did not open, use the button below.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={PILL}
        >
          <PillContent>Open WhatsApp</PillContent>
        </a>
        <Link
          href="/"
          className="mt-5 text-center text-sm font-bold underline underline-offset-4"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  /* ----- Empty / invalid cart ----- */
  if (!cartItems.length || !mainProduct) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 duration-500 animate-in fade-in">
        <h1 className={H1}>
          {!cartItems.length
            ? "Your cart is empty."
            : "Your cart has invalid items."}
        </h1>
        <p className="mb-8 mt-4 text-muted-foreground">
          {!cartItems.length
            ? "Pick a pair to get started."
            : "Clear it and start again."}
        </p>
        <PillCTA
          onClick={() => {
            localStorage.removeItem("cart");
            router.push("/");
          }}
        >
          {!cartItems.length ? "Continue shopping" : "Start over"}
        </PillCTA>
      </main>
    );
  }

  /* ----- Checkout ----- */
  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 pb-44 pt-2">
      <StepBar step={currentStep} />

      {/* key remounts the block so each step enters with the same motion */}
      <div
        key={currentStep}
        className="duration-500 animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none"
      >
        {currentStep === "payment" ? (
          <>
            <h1 className={`mt-5 ${H1}`}>
              Your <span className={CHIP}>2 pairs</span>.
            </h1>

            <section className="mt-6 space-y-2" aria-label="Your pairs">
              <PairRow product={mainProduct} label="1st pair" />
              {freeProduct ? (
                <PairRow product={freeProduct} label="2nd pair free" free />
              ) : (
                <PairRow random label="2nd pair free" free />
              )}
            </section>

            <section className="mt-8" aria-labelledby="pay-title">
              <h2 id="pay-title" className={`mb-3 text-xl ${DISPLAY}`}>
                Payment
              </h2>
              <div role="radiogroup" aria-labelledby="pay-title" className="space-y-2">
                <PayOption
                  id="online"
                  checked={shippingMethod === "online"}
                  onSelect={() => setShippingMethod("online")}
                  title="Online payment"
                  tag={`+${inr(ONLINE_SHIPPING)} shipping`}
                  strongTag
                >
                  <p className="font-bold text-black">
                    Save {inr(COD_CHARGE - ONLINE_SHIPPING)} vs COD
                  </p>
                  <p>Delivery in 5 to 8 days</p>
                </PayOption>

                <PayOption
                  id="cod"
                  checked={shippingMethod === "cod"}
                  onSelect={() => setShippingMethod("cod")}
                  title="Cash on delivery"
                  tag={`+${inr(COD_CHARGE)} extra`}
                >
                  <p>
                    {inr(COD_CHARGE)} is collected in advance. Pay online to
                    save {inr(COD_CHARGE - ONLINE_SHIPPING)}.
                  </p>
                </PayOption>
              </div>
            </section>

            {(settings.freeSocksOffer || settings.shoeCleanerAddon) && (
              <section
                className="mt-8 duration-500 animate-in fade-in slide-in-from-bottom-2"
                aria-labelledby="addon-title"
              >
                <h2 id="addon-title" className={`mb-3 text-xl ${DISPLAY}`}>
                  Add-ons
                </h2>
                <div className="space-y-2">
                  {settings.freeSocksOffer && (
                    <AddOn
                      checked={addSocks}
                      onToggle={() => setAddSocks((v) => !v)}
                      title="Flame Socks"
                      desc="Complete the look. Pairs well with your shoes."
                      price={inr(SOCKS_PRICE)}
                    />
                  )}
                  {settings.shoeCleanerAddon && (
                    <AddOn
                      checked={addShoeCleaner}
                      onToggle={() => setAddShoeCleaner((v) => !v)}
                      title="Premium Shoe Cleaner"
                      desc="Keep both pairs looking fresh."
                      price={inr(SHOE_CLEANER_PRICE)}
                      was="₹199"
                      tag="Limited offer"
                    />
                  )}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setCurrentStep("payment")}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <ArrowIcon className="h-4 w-4 rotate-180" /> Back
            </button>

            <h1 className={`mt-3 ${H1}`}>
              Where should
              <br />
              we <span className={CHIP}>send it?</span>
            </h1>

            {formErrors.length > 0 && (
              <div
                ref={errorRef}
                role="alert"
                className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm font-medium text-destructive duration-300 animate-in fade-in slide-in-from-top-2"
              >
                <p className="mb-1 font-bold">Fix these to continue</p>
                <ul className="list-disc space-y-0.5 pl-5">
                  {formErrors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <CustomerDetailsForm
                customerDetails={customerDetails}
                handleInputChange={handleInputChange}
              />
            </div>
          </>
        )}

        {/* Summary */}
        <section className="mt-10" aria-labelledby="summary-title">
          <h2 id="summary-title" className={`mb-3 text-xl ${DISPLAY}`}>
            Summary
          </h2>
          <div className="space-y-2.5 rounded-2xl bg-muted p-4">
            <Row label="Base price (2 pairs)" value={inr(BASE_PRICE)} />
            {pair1Extra > 0 && (
              <Row indent muted label="Extra, pair 1" value={`+${inr(pair1Extra)}`} />
            )}
            {pair2Extra > 0 && (
              <Row indent muted label="Extra, pair 2" value={`+${inr(pair2Extra)}`} />
            )}
            {hasRandomFreePair && (
              <Row indent muted label="Random surprise pair" value="FREE" />
            )}
            {cleanerCharge > 0 && (
              <Row label="Shoe cleaner" value={`+${inr(SHOE_CLEANER_PRICE)}`} />
            )}
            {socksCharge > 0 && (
              <Row label="Flame socks" value={`+${inr(SOCKS_PRICE)}`} />
            )}
            <Row
              label={
                shippingMethod === "online"
                  ? "Shipping (online)"
                  : "Shipping (COD advance)"
              }
              value={inr(shippingCharge)}
            />
            <div className="flex items-baseline justify-between border-t border-black/10 pt-3">
              <span className="text-sm font-bold">Total</span>
              <span className={`text-2xl ${DISPLAY}`}>{inr(totalAmount)}</span>
            </div>
          </div>

          {shippingMethod === "cod" && (
            <button
              type="button"
              onClick={() => setShippingMethod("online")}
              className="mt-3 w-full text-center text-sm font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Switch to online payment and save{" "}
              {inr(COD_CHARGE - ONLINE_SHIPPING)}
            </button>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            By ordering you agree to the{" "}
            <Link href="/terms" className="font-bold text-black underline">
              Terms and Conditions
            </Link>
            .
          </p>
        </section>
      </div>

      {/* Bottom bar: total and next action stay in reach on both steps */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl bg-background px-4 pt-4 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)]"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Total</p>
            <p className={`text-2xl leading-none ${DISPLAY}`}>
              {inr(totalAmount)}
            </p>
          </div>
          {currentStep === "payment" ? (
            <PillCTA
              onClick={() => setCurrentStep("details")}
              className="min-w-[180px]"
            >
              Continue
            </PillCTA>
          ) : (
            <PillCTA onClick={handleWhatsAppOrder} className="min-w-[200px]">
              Order on WhatsApp
            </PillCTA>
          )}
        </div>
        {currentStep === "details" && (
          <p className="mx-auto mt-2 max-w-xl text-center text-xs text-muted-foreground">
            You will be redirected to WhatsApp to confirm
          </p>
        )}
      </div>
    </main>
  );
}