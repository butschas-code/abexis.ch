/**
 * One-time: download Unsplash site images, upload to Firebase Storage, print URLs.
 * Run: node scripts/upload-site-images.mjs
 * Requires: gcloud auth application-default login
 */

import { execSync } from "node:child_process";

const BUCKET = "abexis-cms.firebasestorage.app";
const STORAGE_PREFIX = "cms/media/site";

/** All images keyed by a stable slug used as the filename. */
const images = [
  // Working originals
  { key: "editorial-insights",      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-insights-desk", url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-hero",          url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-services",      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-process",       url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-contact",       url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-team",          url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-about",         url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80" },
  // Replacements for 404 originals
  { key: "editorial-vakanzen",      url: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=1800&q=80" },
  { key: "editorial-executive",     url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=82" },
];

function getToken() {
  return execSync("gcloud auth application-default print-access-token", { encoding: "utf8" }).trim();
}

async function uploadImage(key, sourceUrl, token) {
  const storagePath = `${STORAGE_PREFIX}/${key}.jpg`;
  const encodedPath = encodeURIComponent(storagePath);

  // Download
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${sourceUrl}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  // Upload via Firebase Storage REST API
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?uploadType=media&name=${encodedPath}`;
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "image/jpeg",
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Upload failed ${uploadRes.status}: ${text}`);
  }

  // Make public
  const aclUrl = `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodedPath}/acl`;
  await fetch(aclUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entity: "allUsers", role: "READER" }),
  });

  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedPath}?alt=media`;
  return downloadUrl;
}

async function main() {
  const token = getToken();
  const results = {};

  for (const { key, url } of images) {
    process.stdout.write(`  ${key} ... `);
    try {
      const downloadUrl = await uploadImage(key, url, token);
      results[key] = downloadUrl;
      console.log("ok");
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }

  console.log("\n--- URLs ---");
  for (const [key, url] of Object.entries(results)) {
    console.log(`${key}: ${url}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
