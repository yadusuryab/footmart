// lib/site-config.ts
// THE ONLY FILE TO EDIT FOR A NEW SITE. Every component reads from here.
// Tailwind v3 only: make sure `./lib/**/*.{ts,tsx}` is in tailwind.config `content`,
// because the theme class strings below live in this file.

const countryCode = "91"; // no "+"
const phone = "8137806172"; // national number, as shown on the site
const whatsapp = `${countryCode}${phone}`; // wa.me and tel: need the country code

export const site = {
  /* ---------- Identity ---------- */
  name: "Footmart",
  brand: { first: "Foot", accent: "mart." }, // wordmark: Foot[mart.]
  logo: { src: "/logo.avif", width: 64, height: 54 },
  instagram: "footmart_",
  phone,
  countryCode,
  whatsapp,
  email: "fashionshoes110@gmail.com",
  address: "India (based in kerala)",
  google_map: "",
  currency: "₹",
  locale: "en-IN",
  social: { instagram: "footmart_", whatsapp }, // kept for older imports

  /* ---------- Header, menu, footer ---------- */
  topBar: ["Cash on Delivery", "All India Shipping", "Kerala Based"],
  menu: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "New arrivals", href: "/new" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  menuNote: "Cash on delivery. Shipping across India.",
  legal: [
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Terms", href: "/T&C" },
  ],
  labels: {
    follow: "Follow",
    chat: "Chat",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    contact: "Contact",
    rights: "All rights reserved.",
  },

  /* ---------- Home sections ---------- */
  hero: {
    href: "/offer?price=1199",
    // Use the real pixel size of the file. It sets the aspect ratio.
    image: { src: "/poster22.jpeg", width: 800, height: 800 },
    alt: "Buy one get one offer",
    badge: "Limited drop",
    cta: "Buy now",
  },
  video: {
    enabled: true,
    src: "/v23.mp4",
    poster: "/v23.avif",
    badge: "28 sec shop video",
    label: "Shop video",
    watchLabel: "Watch shop video",
    title: "See the real process behind our products.",
    text: "Watch how we craft every piece with care.",
    highlights: ["All India delivery", "Premium"],
    cta: "Watch video",
    shopLabel: "Shop now",
    shopHref: "/shop", // opened by the Shop now button. "" = just close.
    soundHint: "Tap for sound",
  },
  reviews: {
    title: ["Loved by our", "customers"] as [string, string], // [plain, highlighted]
    dir: "reviews", // images live in public/<dir>
  },

  /* ---------- Products and offer ---------- */
  products: {
    heading: "Our products",
    firstBatch: 12,
    nextBatch: 8,
    showPrice: false,
    showBogoBadge: false,
    placeholder: "/placeholder-image.jpg",
    empty: "No products found",
    retry: "Try again",
    loadError: "Failed to load products",
  },
  offer: {
    enabled: true, // false = plain size pick, then checkout
    badge: "BOGO",
    freeLabel: "Free",
    firstPairTitle: "Select 1st Pair",
    secondPairTitle: "Select 2nd Pair",
    firstPairLabel: "Your first pair",
    sizeTitle: "Select size",
    sizeLabel: "Size",
    confirmSize: "Confirm size",
    confirmCheckout: "Confirm & checkout",
    sizeError: "Please select a size",
    addedToast: "added to cart!",
    emptyPool: "No more products",
    emoji: { box: "🎁", product: "👟" },
    success: {
      searching: "Picking your surprise…",
      searchingSub: "Hang tight, this one's good",
      unlocked: "Free pair unlocked!",
      unlockedSub: "A random pair of shoes has been added with your purchase.",
      added: "Added to cart",
      redirecting: "Taking you to checkout…",
    },
  },
  copy: {
    defaultHeading: "Get top deals on the newest products",
    viewAll: "View all",
  },

  /* ---------- Theme (full class strings, so Tailwind can see them) ---------- */
  theme: {
    // Abstract mesh gradient. Change the three hex colours to match the brand.
    mesh: "bg-[#10b981] bg-[radial-gradient(circle_at_15%_20%,#d9f99d,transparent_45%),radial-gradient(circle_at_90%_25%,#22d3ee,transparent_50%),radial-gradient(circle_at_55%_110%,#a7f3d0,transparent_60%)]",
    card: "bg-gradient-to-r from-purple-500 via-blue-500 to-violet-700",
    accentText:
      "bg-gradient-to-r from-lime-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent",
    confetti: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#a855f7"],
  },
};

/* ---------- Helpers ---------- */
export const instagramUrl = `https://instagram.com/${site.instagram}`;
export const telUrl = `tel:+${site.whatsapp}`;
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const formatPrice = (n?: number | null) =>
  n == null ? "" : `${site.currency}${n.toLocaleString(site.locale)}`;
