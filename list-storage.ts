import { getApp, getApps, initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import * as fs from "fs";

// Load from .env.local manually
const envFile = fs.readFileSync(".env.local", "utf-8");
envFile.split("\n").forEach(line => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }
});

const app = getApps().length > 0 ? getApp() : initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
});

async function run() {
  console.log("Files in cms/media/site/:");
  const [files] = await getStorage(app).bucket().getFiles({ prefix: "cms/media/site/" });
  files.forEach(f => console.log(f.name));
  
  console.log("Files in public/images/site/:");
  const [files2] = await getStorage(app).bucket().getFiles({ prefix: "public/images/site/" });
  files2.forEach(f => console.log(f.name));
}

run().catch(console.error);
