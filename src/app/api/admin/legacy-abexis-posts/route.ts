import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

/**
 * Serves `data/legacy-abexis-posts.json` only when a valid Firebase **ID token** is presented.
 * Uses Identity Toolkit token lookup (no Admin SDK / service account).
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Missing Bearer token." }, { status: 401 });
  }
  const idToken = authHeader.slice("Bearer ".length).trim();
  if (!idToken) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Empty token." }, { status: 401 });
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "SERVER_MISCONFIG", message: "NEXT_PUBLIC_FIREBASE_API_KEY is not set." },
      { status: 500 },
    );
  }

  const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`;
  const vr = await fetch(lookupUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!vr.ok) {
    return NextResponse.json({ error: "INVALID_TOKEN", message: "Token verification failed." }, { status: 401 });
  }
  const body = (await vr.json()) as { users?: unknown[] };
  if (!Array.isArray(body.users) || body.users.length === 0) {
    return NextResponse.json({ error: "INVALID_TOKEN", message: "No user for token." }, { status: 401 });
  }

  try {
    const path = join(process.cwd(), "data", "legacy-abexis-posts.json");
    const raw = readFileSync(path, "utf8");
    return new NextResponse(raw, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "data/legacy-abexis-posts.json could not be read." },
      { status: 404 },
    );
  }
}
