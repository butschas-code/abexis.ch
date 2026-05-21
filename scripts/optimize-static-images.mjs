/**
 * Re-encode raster assets under `public/` as WebP (quality 82) and remove originals.
 * Run after adding images: `pnpm run optimize:images`
 *
 * Skips SVG. With `images.unoptimized` in Next, smaller files = faster loads.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public");
const RASTER_EXT = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]);
const WEBP_OPTS = { quality: 82, effort: 6 };

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (RASTER_EXT.has(path.extname(name))) out.push(full);
  }
  return out;
}

async function main() {
  const files = walk(ROOT);
  if (!files.length) {
    console.log("No raster images under public/ to optimize.");
    return;
  }

  for (const abs of files) {
    const dir = path.dirname(abs);
    const base = path.basename(abs, path.extname(abs));
    const dest = path.join(dir, `${base}.webp`);

    // Already webp target exists alongside duplicate — skip weird cases
    const before = (await fs.promises.stat(abs)).size;

    await sharp(abs).rotate().webp(WEBP_OPTS).toFile(dest);

    await fs.promises.unlink(abs);

    const after = (await fs.promises.stat(dest)).size;
    const rel = path.relative(process.cwd(), dest);
    console.log(`${rel}  (${before} → ${after} bytes, ${Math.round((1 - after / before) * 100)}% smaller)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
