// app/privacy/page.tsx
// Server component: ships no client JavaScript, no images and no icon library.
import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | Footmart",
  description:
    "Read the privacy policy of Footmart to understand how we handle your data.",
};

const LAST_UPDATED = "3 November 2026"; // update when you change the policy

const DISPLAY = "font-black italic tracking-tighter";

type Section = {
  id: string;
  title: string;
  intro?: string;
  items?: [term: string, description: string][];
  outro?: string;
};

const sections: Section[] = [
  {
    id: "information",
    title: "Information we collect",
    intro: "When you place an order, we ask for the following.",
    items: [
      ["Name", "Your full name, used to process and fulfil your order."],
      [
        "Phone numbers",
        "One required number and one optional second number. We use them to confirm your order, share status updates and give you support.",
      ],
      [
        "Delivery address",
        "Your address, district, state, pincode and an optional landmark, so your order reaches you.",
      ],
      [
        "Instagram ID",
        "Optional. If you give it, we may use it to follow up on your order.",
      ],
      [
        "Order details",
        "The products, sizes, add-ons and payment method you choose.",
      ],
      [
        "Cart data",
        "Your cart is saved in your browser, on your device, so it survives a page refresh. We do not create an account for you.",
      ],
      [
        "Anything else you share",
        "Any other details you choose to send us to improve your shopping experience.",
      ],
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    items: [
      [
        "Order processing",
        "To process and fulfil your orders accurately and efficiently.",
      ],
      [
        "Communication",
        "To send order confirmations and status updates, and to answer your questions.",
      ],
      [
        "Service improvement",
        "To analyse how the site is used, so we can improve the website, our products and your shopping experience.",
      ],
      [
        "Marketing",
        "To send promotions and special offers, only if you have chosen to receive them.",
      ],
      [
        "Legal compliance",
        "To comply with applicable laws, regulations and legal obligations.",
      ],
    ],
  },
  {
    id: "sharing",
    title: "Sharing your information",
    intro:
      "Your privacy matters to us. We share your personal information with trusted third parties only in these situations.",
    items: [
      [
        "Suppliers",
        "The information needed for our suppliers to fulfil your order.",
      ],
      [
        "Service providers",
        "Third parties that handle payment processing, shipping and other essential functions.",
      ],
      [
        "WhatsApp",
        "Orders reach us as a WhatsApp message. WhatsApp is run by Meta and has its own privacy policy.",
      ],
      [
        "Legal requirements",
        "When the law requires it, or in response to a valid request from a public authority.",
      ],
    ],
  },
  {
    id: "security",
    title: "Data security",
    intro:
      "We use a range of security measures to protect your personal information from unauthorised access, use or disclosure. These include encryption, firewalls and secure server hosting.",
  },
  {
    id: "rights",
    title: "Your rights",
    items: [
      [
        "Access",
        "Ask for a copy of the personal information we hold about you.",
      ],
      ["Correction", "Ask us to fix anything that is inaccurate."],
      [
        "Deletion",
        "Ask us to delete your personal information, subject to legal exceptions.",
      ],
      ["Opt-out", "Stop receiving marketing messages at any time."],
    ],
    outro: "To use any of these rights, contact us using the details below.",
  },
  {
    id: "changes",
    title: "Changes to this policy",
    intro:
      "We may update this Privacy Policy from time to time. Updates will be posted on this page.",
  },
  {
    id: "links",
    title: "Third-party links",
    intro:
      "Our website may link to third-party websites. We are not responsible for their content or privacy practices.",
  },
  {
    id: "children",
    title: "Children’s privacy",
    intro:
      "Our services are not directed to anyone under the age of 13. We do not knowingly collect personal information from children.",
  },
];

const bodyText = "max-w-prose text-[15px] leading-7 text-foreground/80";

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-4 duration-500 animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none sm:px-6">
      <h1
        className={`text-[clamp(2.5rem,10vw,4rem)] leading-[1] ${DISPLAY}`}
      >
        Privacy
        <br />
        <span className="rounded-md bg-black px-1.5 py-0.5 text-primary">
          policy.
        </span>
      </h1>

      <p className={`mt-6 ${bodyText}`}>
        At Footmart, we are dedicated to protecting your privacy and securing
        the personal information you provide. This policy explains how we
        collect, use and share your data when you visit our website or place an
        order.
      </p>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">
        Last updated {LAST_UPDATED}
      </p>

      {/* Jump list */}
      <nav aria-label="On this page" className="mt-8">
        <ol className="grid gap-1 sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-baseline gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none"
              >
                <span className="w-4 text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-bold tracking-tight">
                  {s.title}
                </span>
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="flex items-baseline gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none"
            >
              <span className="w-4 text-xs font-bold text-muted-foreground">
                {sections.length + 1}
              </span>
              <span className="text-sm font-bold tracking-tight">
                Contact us
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
            className={`flex items-baseline gap-3 text-2xl ${DISPLAY}`}
          >
            <span className="text-base text-muted-foreground">{i + 1}</span>
            {s.title}
          </h2>

          {s.intro && <p className={`mt-3 ${bodyText}`}>{s.intro}</p>}

          {s.items && (
            <dl className="mt-4 border-b border-black/10">
              {s.items.map(([term, description]) => (
                <div
                  key={term}
                  className="border-t border-black/10 py-3 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-6"
                >
                  <dt className="text-sm font-bold tracking-tight">{term}</dt>
                  <dd className="mt-1 text-[15px] leading-7 text-foreground/80 sm:mt-0">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
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
          className={`flex items-baseline gap-3 text-2xl ${DISPLAY}`}
        >
          <span className="text-base text-muted-foreground">
            {sections.length + 1}
          </span>
          Contact us
        </h2>
        <p className={`mt-3 ${bodyText}`}>
          Questions about this policy, or want to use one of your rights?
          Message us.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${site.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full bg-black px-6 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            WhatsApp
          </a>
          <a
            href={`https://instagram.com/${site.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full bg-muted px-6 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            @{site.instagram}
          </a>
        </div>
      </section>

      {/* Credit */}
      <footer className="mt-16 border-t border-black/10 pt-6 text-sm text-muted-foreground">
        <p className="font-bold text-foreground">Website made by Yadulabs.</p>
        <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <Link
            href="https://instagram.com/yadulabs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            yadulabs on Instagram
          </Link>
         
        </p>
      </footer>
    </main>
  );
}