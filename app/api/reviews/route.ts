// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

export async function GET() {
  try {
    const reviewsDir = path.join(process.cwd(), "public", "reviews");
    const files = await readdir(reviewsDir);

    const images = files
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => `/reviews/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Failed to read reviews directory:", error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}