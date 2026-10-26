/**
 * Small WebP thumbnails for card images (service cards, team portraits).
 * `images.unoptimized` is on (see next.config.ts), so the browser would otherwise download
 * the full-size originals (up to ~5000 px) for ~300–500 px cards.
 *
 * Run after changing a card image: `pnpm run thumbnails`
 * Output: `public/images/thumbs/<name>.webp` (committed). Add new cards to MANIFEST and to
 * `thumbnailImages` in `src/data/site-images.ts`.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

/** Cards render at ~300–500 CSS px; the client asked for ~500 px wide sources. */
const CARD_WIDTH = 500;
const OUT_DIR = path.join(process.cwd(), "public", "images", "thumbs");
const WEBP_OPTS = { quality: 80, effort: 6 };

const hoststar = (file) => `https://files.designer.hoststar.ch/${file.slice(0, 2)}/${file.slice(2, 4)}/${file}`;

const MANIFEST = [
  // Service cards (keys match `serviceCardImages`)
  { name: "service-virtual-management-office", src: "public/images/focus/virtual-management-office.webp" },
  { name: "service-virtual-management-office-en", src: "public/images/focus/virtual-management-office-en.webp" },
  { name: "service-projectrealitycheck", src: "public/images/focus/project-reality-check.webp" },
  { name: "service-projectrealitycheck-en", src: "public/images/focus/project-reality-check-en.webp" },
  { name: "service-digitale-transformation", src: hoststar("63e576e4-c0c4-4f5f-8728-933b9942b728.jpg") },
  { name: "service-unternehmensstrategie", src: hoststar("9c92913c-0059-4700-9c9a-10c3bc466183.jpg") },
  { name: "service-vertriebmarketing", src: hoststar("d02d6b52-0f95-498d-abdc-ea05afb7062a.jpg") },
  { name: "service-veraenderungsmanagement", src: hoststar("e368bc9e-42aa-4e8f-9c81-acc2a7ae2c6b.jpeg") },
  { name: "service-prozessoptimierung", src: hoststar("86af60f1-9ed6-4736-9be9-07449647064b.jpg") },
  { name: "service-projektmanagement", src: "public/images/focus/projektmanagement.webp" },
  { name: "service-plm-pdm", src: "public/images/focus/plm-pdm.webp" },
  { name: "service-risikomanagement", src: "public/images/focus/risikomanagement.webp" },
  { name: "service-executive-search", src: "public/images/daniel-sengstag/hero.webp" },
  // Team portraits (keys match `teamProfiles`)
  { name: "team-danielsengstag", src: hoststar("4f9e368c-3919-4b65-8c73-ad8c8f493d75.jpg") },
  { name: "team-christophwainig", src: hoststar("7c5eb14e-4f16-428a-a581-c4cb4ee8185d.jpg") },
  { name: "team-katrinyuan", src: hoststar("b7ce050b-82b4-4acb-905f-bda7e0b119c5.jpg") },
  { name: "team-sergegarazi", src: hoststar("cdd4878d-fb8f-4d27-94c2-1aaa97bb1697.jpg") },
  { name: "team-williamdemaeyer", src: hoststar("0b4b171f-3d10-4947-af9f-4bea14040a25.jpg") },
  { name: "team-sachamoeller", src: hoststar("6ba66ce4-e338-42a5-9363-9bde653084c3.JPG") },
  { name: "team-renatesengstag", src: hoststar("d9de5400-785e-47ca-b6c6-fd49b25ba2f8.jpg") },
  // Header/footer logo renders ~90 px wide; 400 px stays sharp on high-density screens.
  { name: "logo", src: hoststar("9fa6de2e-48f4-4837-8a9b-43f06f5ecc7f.jpg"), width: 400 },
  // Homepage "Zusammenarbeit" image: full width below lg, so a little larger than a card.
  { name: "home-process", src: hoststar("55083c41-1989-4ce2-8afd-eb297c90bd01.jpg"), width: 900 },
];

async function load(src) {
  if (!src.startsWith("http")) return fs.promises.readFile(path.join(process.cwd(), src));
  const res = await fetch(src);
  if (!res.ok) throw new Error(`${res.status} for ${src}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  for (const { name, src, width = CARD_WIDTH } of MANIFEST) {
    const input = await load(src);
    const dest = path.join(OUT_DIR, `${name}.webp`);
    const info = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp(WEBP_OPTS).toFile(dest);
    console.log(`${path.relative(process.cwd(), dest)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
