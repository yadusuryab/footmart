#!/usr/bin/env node
/**
 * Finds media files in /public that nothing in your code references.
 *
 *   node find-unused-media.js            -> report only (safe)
 *   node find-unused-media.js --delete   -> report, then ask before deleting "unused" files
 *   node find-unused-media.js --used     -> show only the files that ARE used
 *
 * Run it from the project root. No dependencies.
 */
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

const MEDIA_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg", ".ico", ".bmp",
  ".mp4", ".webm", ".mov", ".mp3", ".wav", ".ogg",
  ".woff", ".woff2", ".ttf", ".otf", ".pdf",
]);
const TEXT_EXT = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".vue", ".astro",
  ".css", ".scss", ".sass", ".less", ".html", ".md", ".mdx",
  ".json", ".svg", ".xml", ".webmanifest", ".txt",
]);
const IGNORE_DIRS = new Set([
  "node_modules", ".next", ".git", "dist", "build", "out",
  ".vercel", ".turbo", "coverage", ".cache",
]);
const IGNORE_FILES = new Set([
  "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb",
]);
const MAX_TEXT_BYTES = 2 * 1024 * 1024;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const fmt = (bytes) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error("No /public folder found. Run this from your project root.");
  process.exit(1);
}

// 1. Media files in /public
const mediaFiles = walk(PUBLIC_DIR)
  .filter((f) => MEDIA_EXT.has(path.extname(f).toLowerCase()))
  .map((abs) => {
    const rel = path.relative(PUBLIC_DIR, abs).split(path.sep).join("/");
    return {
      abs,
      url: "/" + rel,
      name: path.basename(abs),
      size: fs.statSync(abs).size,
    };
  });

// 2. One big text corpus of everything that could reference them
let corpus = "";
for (const file of walk(ROOT)) {
  if (IGNORE_FILES.has(path.basename(file))) continue;
  if (!TEXT_EXT.has(path.extname(file).toLowerCase())) continue;
  if (fs.statSync(file).size > MAX_TEXT_BYTES) continue;
  corpus += "\n" + fs.readFileSync(file, "utf8");
}

// 3. Dynamic references like `/images/${name}.png` or "/images/" + name
const dynamicPrefixes = new Set();
for (const re of [
  /(\/[\w\-./]*\/)\$\{/g,
  /["'`](\/[\w\-./]*\/)["'`]\s*\+/g,
]) {
  for (const m of corpus.matchAll(re)) dynamicPrefixes.add(m[1]);
}

// 4. Classify
const used = [];
const unused = [];
const maybe = [];
for (const f of mediaFiles) {
  const variants = [f.url, encodeURI(f.url)];
  if (variants.some((v) => corpus.includes(v))) {
    used.push(f); // used by path
    continue;
  }

  const dynamic = [...dynamicPrefixes].find((p) => f.url.startsWith(p));
  if (dynamic) {
    maybe.push({ ...f, why: `folder built dynamically (${dynamic}\${...})` });
  } else if (corpus.includes(f.name)) {
    maybe.push({ ...f, why: "file name appears in code, but not its /public path" });
  } else {
    unused.push(f);
  }
}

const bySize = (a, b) => b.size - a.size;
used.sort(bySize);
unused.sort(bySize);
maybe.sort(bySize);

if (process.argv.includes("--used")) {
  console.log(`\nUSED (${used.length} of ${mediaFiles.length} media files)`);
  for (const f of used) console.log(`  ${fmt(f.size).padStart(10)}  ${f.url}`);
  console.log(`  Total: ${fmt(used.reduce((s, f) => s + f.size, 0))}\n`);
  process.exit(0);
}

console.log(`\nChecked ${mediaFiles.length} media files in /public\n`);

console.log(`UNUSED (${unused.length}) - no reference found anywhere`);
for (const f of unused) console.log(`  ${fmt(f.size).padStart(10)}  ${f.url}`);
console.log(
  `  Reclaimable: ${fmt(unused.reduce((s, f) => s + f.size, 0))}\n`,
);

if (maybe.length) {
  console.log(`CHECK MANUALLY (${maybe.length}) - might be used`);
  for (const f of maybe)
    console.log(`  ${fmt(f.size).padStart(10)}  ${f.url}\n              ${f.why}`);
  console.log("");
}

// 5. Optional delete (only the clearly unused ones)
if (process.argv.includes("--delete") && unused.length) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`Delete ${unused.length} unused files? Type "yes" to confirm: `, (a) => {
    rl.close();
    if (a.trim().toLowerCase() !== "yes") return console.log("Nothing deleted.");
    for (const f of unused) fs.unlinkSync(f.abs);
    console.log(`Deleted ${unused.length} files.`);
  });
}