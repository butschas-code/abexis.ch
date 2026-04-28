import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminStorage } from "@/firebase/server";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_FILES = 5;
const SIGNED_URL_EXPIRY_MS = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years (forms archive)

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
]);

/**
 * Anonymous-friendly upload for form attachments. Files are stored via **Admin SDK**
 * (public clients cannot write Storage rules directly).
 *
 * POST `multipart/form-data` with field **`files`** (one or more).
 * Returns `{ urls: string[], paths: string[] }` : pass `urls` into `POST /api/cms/v1/form-submissions` as `fileUrls`.
 */
export async function POST(req: Request) {
  const storage = getAdminStorage();
  if (!storage) {
    return NextResponse.json(
      { error: "CMS_ADMIN_NOT_CONFIGURED", message: "Storage requires Firebase Admin credentials." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_FORM_DATA" }, { status: 400 });
  }

  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET?.trim() || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  if (!bucketName) {
    return NextResponse.json({ error: "STORAGE_BUCKET_NOT_CONFIGURED" }, { status: 503 });
  }

  const bucket = storage.bucket(bucketName);
  const uploadId = randomUUID();
  const urls: string[] = [];
  const paths: string[] = [];

  const files = form.getAll("files").filter((e): e is File => e instanceof File && e.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ error: "NO_FILES" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: "TOO_MANY_FILES", max: MAX_FILES }, { status: 400 });
  }

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "FILE_TOO_LARGE", maxBytes: MAX_BYTES }, { status: 400 });
    }
    const type = file.type || "application/octet-stream";
    if (!ALLOWED_MIME.has(type)) {
      return NextResponse.json({ error: "UNSUPPORTED_TYPE", mime: type }, { status: 400 });
    }
    const safeName =
      file.name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120) || "upload.bin";
    const path = `cms/submissions/incoming/${uploadId}/${Date.now()}-${safeName}`;
    const buf = Buffer.from(await file.arrayBuffer());
    
    try {
      const f = bucket.file(path);
      const downloadToken = randomUUID();
      
      await f.save(buf, {
        contentType: type,
        resumable: false,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });
      
      const encodedPath = encodeURIComponent(path);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${downloadToken}`;
      
      urls.push(publicUrl);
      paths.push(path);
    } catch (firebaseErr: any) {
      console.error("Firebase Storage explicit error:", firebaseErr);
      return NextResponse.json({ error: "UPLOAD_REJECTED", message: firebaseErr?.message || "Unknown Firebase Storage error" }, { status: 500 });
    }
  }

  return NextResponse.json({ urls, paths }, { status: 201 });
}
