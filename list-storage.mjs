import { getApp, getApps, initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import dotenv from "dotenv";
dotenv.config();

const app = getApps().length > 0 ? getApp() : initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
});

async function run() {
  const [files] = await getStorage(app).bucket().getFiles({ prefix: "cms/media/site/" });
  files.forEach(f => console.log(f.name));
  
  const [files2] = await getStorage(app).bucket().getFiles({ prefix: "public/images/site/" });
  files2.forEach(f => console.log(f.name));
}

run().catch(console.error);
