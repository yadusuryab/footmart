import { site } from "@/lib/site-config";
import React from "react";

interface BrandProps {
  small?: boolean;
  className?: string;
}

const Brand: React.FC<BrandProps> = ({ small = false, className = "" }) => {
  // ✅ OPTIMIZED: If SVG, use inline SVG or optimized file
  return (
    <div className={className}>
      {/* If SVG file is already optimized, keep using Image */}
      <img
        src="/logo.png" // ✅ Direct path if SVG
        width={small ? 64 : 54}
        height={small ? 54 : 54}
        alt={site.name}
        className={`object-contain rounded-full ${small ? "max-w-full" : "max-w-full"}`}
        loading="eager"
      />
    </div>
  );
};

export default Brand;