import Image from "next/image";
import { site } from "@/lib/site-config";

interface BrandProps {
  small?: boolean;
  className?: string;
}

// next/image serves resized AVIF/WebP at 1x and 2x. Priority = LCP preload.
const Brand = ({ small = false, className = "" }: BrandProps) => {
  const { src, width, height } = site.logo;
  const w = small ? width : height;
  return (
    <Image
      src={src}
      width={w}
      height={height}
      sizes={`${w}px`}
      quality={70}
      priority={small}
      alt={site.name}
      className={`rounded-full object-contain ${className}`}
    />
  );
};

export default Brand;