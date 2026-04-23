/**
 * Search-brief submissions: validates JSON and forwards to `CONTACT_WEBHOOK_URL` when set
 * (Zapier, Make, internal edge function, etc.). For Firestore or e-mail backends, extend here.
 */
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(80).optional().or(z.literal("")),
  message: z.string().min(1).max(8000),
  consent: z.literal(true),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const payload = parsed.data;
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "abexis.ch/executive-search",
          ...payload,
          receivedAt: new Date().toISOString(),
        }),
      });
    } catch {
      return NextResponse.json({ ok: false, error: "webhook" }, { status: 502 });
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[contact]", payload);
  }

  return NextResponse.json({ ok: true });
}
