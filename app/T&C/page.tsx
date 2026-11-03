// app/terms/page.tsx
// Server component: ships no client JavaScript, no images and no icon library.
import type { Metadata } from "next";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions | Footmart",
  description:
    "Read the terms and conditions for orders, returns, replacements and delivery at Footmart.",
};

const LAST_UPDATED = "3 November 2026"; // update when you change the terms

const DISPLAY = "font-black italic tracking-tighter";

type Section = {
  id: string;
  title: string;
  paras?: string[];
  points?: string[];
  outro?: string;
};

// The three rules people most often miss, pulled from the sections below.
const highlights: [title: string, text: string][] = [
  [
    "Replacement, not refund",
    "Wrong size, wrong item or damaged products are replaced. Refunds apply only if the courier loses the parcel, under specific conditions.",
  ],
  [
    "Unboxing video within 24 hours",
    "Record a full 360-degree unboxing video and report any issue within 24 hours of delivery.",
  ],
  [
    "No cancellations",
    "An order cannot be cancelled after it is placed.",
  ],
];

const sections: Section[] = [
  {
    id: "returns",
    title: "Return and replacement policy",
    points: [
      "You can return the product for a replacement if it is the wrong size, incorrect, or damaged.",
      "We do not offer exchanges, returns or refunds for reasons related to personal preference or dislike. We strive to provide the best, but individual tastes vary.",
    ],
    outro:
      "Refunds are not available, only replacements. However, if the courier service loses the product, a refund is applicable under specific conditions.",
  },
  {
    id: "unboxing",
    title: "Unboxing video requirements",
    points: [
      "A 360-degree unboxing video of the parcel is mandatory for any claim about damage, incorrect size, missing items and similar issues. The issue must be clearly shown in the video, without pauses or cuts. It must be reported within 24 hours of receiving the parcel.",
      "The video must begin by showing the address label as sent by us, including the outer packaging.",
    ],
    outro:
      "Some customers forget to record an unboxing video and later create fake ones. We do not accept such videos as proof. All customers must follow these guidelines.",
  },
  {
    id: "images",
    title: "AI-generated images and product representation",
    paras: [
      "Some of our product visuals are created using AI for display purposes. We make sincere efforts to deliver products that closely match the images shown.",
      "Minor variations in color tone, texture, shine or finishing may occur due to lighting conditions, AI rendering, screen differences or stock variations. These are normal aspects of digital product representation.",
    ],
    points: [
      "Variations arising from visual representation, lighting effects or digital creation methods are not considered manufacturing defects and are not eligible for return or replacement.",
    ],
  },
  {
    id: "bogo",
    title: "Buy 1 Get 1 offer: quality and pricing",
    paras: [
      "Our Buy 1 Get 1 offer is structured to provide maximum value within this price range. The products offered under this promotion are 6A quality replicas, and their quality is aligned with the offer pricing.",
      "Please note that 6A is a commercial market grading term used for replica products. It does not mean the product is original, officially branded, or authorized by the brand owner.",
    ],
  },
  {
    id: "notes",
    title: "Important notes",
    points: [
      "Slight color variation or light and dark differences may occur due to digital photography or device screen settings. Images shown may differ slightly from the actual product.",
      "For combo or offer items, the model is as per your order, but minor color variations may occur depending on stock availability. We always ensure the closest possible match to your chosen color.",
      "Minor issues like loose threads, removable stains or slight stitching imperfections are not considered damage.",
    ],
  },
  {
    id: "keep-in-mind",
    title: "Keep in mind",
    points: [
      "Cancellation is not allowed after placing the order.",
      "If you want to replace a product, you must bear the courier charges. If the issue is from our side, we will cover the courier cost only after you provide the dispatch slip.",
      "The quality of the product is based on the price you pay.",
    ],
  },
  {
    id: "shipping",
    title: "Shipping and delivery",
    points: [
      "We do not own any courier service. We send parcels through third-party couriers.",
      "If delivery is delayed, we are not responsible, as it is beyond our control. However, support is available 24x7 from our side, and we put in full effort to resolve the issue. If it remains unresolved, it will be handled through mutual discussion.",
      "Do not request refunds or order cancellations because of courier delays. Please be patient and cooperate.",
    ],
  },
  {
    id: "sizes",
    title: "Size replacement conditions",
    points: [
      "If you want to replace the delivered product with the same shoes in a different size, it will be processed based on stock availability.",
      "If you ordered size 10 and received the correct size, you cannot later exchange for a larger size. We clearly state the maximum available size (size 10) before purchase. Likewise, if you ordered size 6 and want size 5, which is smaller, this is also not possible. Keep this in mind when placing your order.",
    ],
  },
];

const bodyText = "max-w-prose text-[15px] leading-7 text-foreground/80";
const jumpLink =
  "flex items-baseline gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none";
const contactLink =
  "inline-flex h-12 items-center rounded-full px-6 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function TermsAndConditions() {
  const contactNo = sections.length + 1;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-4 duration-500 animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none sm:px-6">
      <h1
        className={`text-[clamp(2.5rem,10vw,4rem)] leading-[1] ${DISPLAY}`}
      >
        Terms &amp;
        <br />
        <span className="rounded-md bg-black px-1.5 py-0.5 text-primary">
          conditions.
        </span>
      </h1>

      <p className={`mt-6 ${bodyText}`}>
        By placing an order, you agree to these terms and conditions. Please
        read them before you order.
      </p>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">
        Last updated {LAST_UPDATED}
      </p>

      {/* The short version */}
      <section aria-label="Key points" className="mt-8 grid gap-2 sm:grid-cols-3">
        {highlights.map(([title, text]) => (
          <div key={title} className="rounded-2xl bg-muted p-4">
            <p className="text-sm font-bold tracking-tight">{title}</p>
            <p className="mt-1.5 text-xs leading-5 text-foreground/70">{text}</p>
          </div>
        ))}
      </section>

      {/* Jump list */}
      <nav aria-label="On this page" className="mt-8">
        <ol className="grid gap-1 sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={jumpLink}>
                <span className="w-4 shrink-0 text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-bold tracking-tight">
                  {s.title}
                </span>
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" className={jumpLink}>
              <span className="w-4 shrink-0 text-xs font-bold text-muted-foreground">
                {contactNo}
              </span>
              <span className="text-sm font-bold tracking-tight">
                Questions before you order
              </span>
            </a>
          </li>
        </ol>
      </nav>

      {/* Sections */}
      {sections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-title`}
          className="mt-12 scroll-mt-28"
        >
          <h2
            id={`${s.id}-title`}
            className={`flex items-baseline gap-3 text-2xl leading-tight ${DISPLAY}`}
          >
            <span className="text-base text-muted-foreground">{i + 1}</span>
            {s.title}
          </h2>

          {s.paras?.map((p) => (
            <p key={p} className={`mt-3 ${bodyText}`}>
              {p}
            </p>
          ))}

          {s.points && (
            <ul className="mt-4 border-b border-black/10">
              {s.points.map((point) => (
                <li
                  key={point}
                  className="border-t border-black/10 py-3 text-[15px] leading-7 text-foreground/80"
                >
                  {point}
                </li>
              ))}
            </ul>
          )}

          {s.outro && <p className={`mt-4 ${bodyText}`}>{s.outro}</p>}
        </section>
      ))}

      {/* Contact */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="mt-12 scroll-mt-28"
      >
        <h2
          id="contact-title"
          className={`flex items-baseline gap-3 text-2xl leading-tight ${DISPLAY}`}
        >
          <span className="text-base text-muted-foreground">{contactNo}</span>
          Questions before you order
        </h2>
        <p className={`mt-3 ${bodyText}`}>
          If you have any doubts about these terms, clarify them with us before
          placing your order.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${site.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${contactLink} bg-black text-white`}
          >
            WhatsApp
          </a>
          <a
            href={`https://instagram.com/${site.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${contactLink} bg-muted`}
          >
            @{site.instagram}
          </a>
        </div>
      </section>

      <p className="mt-16 border-t border-black/10 pt-6 text-sm font-bold">
        Best regards, Footmart team
      </p>
    </main>
  );
}