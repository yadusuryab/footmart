// lib/reviews.ts
// Reads public/<site.reviews.dir>. Replace the body if your reviews live elsewhere
// (database, Cloudinary, Blob), and call it from /api/reviews too.

import { readdir } from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/site-config";

export async function getReviewImages(): Promise<string[]> {
  const dir = site.reviews.dir;
  try {
    const files = await readdir(path.join(process.cwd(), "public", dir));
    return files
      .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/${dir}/${f}`);
  } catch {
    return [];
  }
}