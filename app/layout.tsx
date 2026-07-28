import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site-config";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import GoogleTagManager from "@/components/analyatics/GoogleTagManager";

// ✅ OPTIMIZED: Preload only necessary font weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // ✅ Added multiple weights
  display: "swap", // ✅ Better performance
  preload: true, // ✅ Keep preload for critical font
  fallback: ["system-ui", "arial"], // ✅ Better fallback
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}` // ✅ Better SEO
  },
  description: "Buy quality products at affordable price.",
  keywords: ["shoes", "footwear", "fashion", "affordable"], // ✅ Added for SEO
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
        <link rel="apple-touch-icon" href="/apple-touch-icon?<generated>" type="image/<generated>" sizes="<generated>" />
        
        {/* Meta Pixel Script */}
      
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '1029537976161506');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src="https://www.facebook.com/tr?id=1029537976161506&ev=PageView&noscript=1"
              />
            </noscript>
          </>
     
      </head>
      
      <body className={`${poppins.className} antialiased bg-[#f7f7f7]`}>
        <Header />
        <main className="py-5 min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
        
        {process.env.NODE_ENV === 'production' && <GoogleTagManager />}
      </body>
    </html>
  );
}
