"use client";

import Poster2 from "@/public/h2.png";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "../ui/button";

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full md:max-w-[400px] mx-auto px-4 sm:px-6">
      <Link href="/offer?price=1199" className="block group">
        <div className="relative rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0_0_#000] transition-transform duration-200 group-hover:-translate-y-0.5">

          <div className="relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-primary/20 animate-pulse flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <Image
              src={Poster2}
              alt="BOGO at ₹999!"
              width={800}
              height={800}
              className={`w-full h-auto block transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              priority
              quality={60}
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 600px"
              onLoad={() => setImageLoaded(true)}
              placeholder="blur"
            />

            <div className="absolute top-3 left-3 z-10 bg-black text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white">
              Limited Drop
            </div>
          </div>

          <div className="bg-primary text-center font-bold border-t-2 border-black px-4 py-3 flex items-center justify-center gap-3">
          

            <Button variant="ghost" className="font-bold text-md">
                Buy now
              <IconArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}