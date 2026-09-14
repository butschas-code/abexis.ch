import "server-only";

const NUELINK_API_BASE = "https://nuelink.com/api/public/v1";

export type NuelinkPublishMode = "QUEUE" | "DRAFT" | "IMMEDIATE" | "SCHEDULE";
export type NuelinkSocialTarget = "linkedin" | "x";

export type NuelinkCreatePostResult = {
  postId: string;
  message: string | null;
  brandId: number;
  collectionId: number;
  publishMode: NuelinkPublishMode;
  target: NuelinkSocialTarget;
};

export class NuelinkApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NuelinkApiError";
    this.status = status;
  }
}

const NUELINK_RETRY_DELAYS_MS = [2_000, 5_000, 10_000] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableNuelinkError(error: unknown): boolean {
  if (error instanceof NuelinkApiError) {
    return error.status === 429 || error.status >= 500;
  }
  if (error instanceof Error) {
    return /too many requests|429|rate limit/i.test(error.message);
  }
  return false;
}

type NuelinkCreatePostBody = {
  caption: string;
  publishMode: NuelinkPublishMode;
  scheduledAt?: string;
  link?: string;
  title?: string;
  alt?: string;
  media?: Array<{ url: string }>;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Nuelink ist noch nicht konfiguriert (${name}).`);
  return value;
}

function readRequiredIntEnv(name: string): number {
  const raw = readRequiredEnv(name);
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Nuelink-Konfiguration ist ungültig (${name}).`);
  }
  return parsed;
}

function resolvePublishMode(override?: NuelinkPublishMode | null): NuelinkPublishMode {
  if (override === "DRAFT" || override === "IMMEDIATE" || override === "SCHEDULE" || override === "QUEUE") return override;
  const raw = process.env.NUELINK_PUBLISH_MODE?.trim().toUpperCase();
  if (raw === "DRAFT" || raw === "IMMEDIATE" || raw === "SCHEDULE") return raw;
  return "QUEUE";
}

function resolveCollectionId(target: NuelinkSocialTarget): number {
  const platformSpecific =
    target === "linkedin" ? process.env.NUELINK_LINKEDIN_COLLECTION_ID : process.env.NUELINK_X_COLLECTION_ID;
  const raw = platformSpecific?.trim() || process.env.NUELINK_COLLECTION_ID?.trim();
  if (!raw) {
    throw new Error(
      target === "linkedin"
        ? "Nuelink LinkedIn-Collection fehlt (NUELINK_LINKEDIN_COLLECTION_ID oder NUELINK_COLLECTION_ID)."
        : "Nuelink X-Collection fehlt (NUELINK_X_COLLECTION_ID oder NUELINK_COLLECTION_ID).",
    );
  }
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Nuelink Collection-ID ist ungültig.");
  }
  return parsed;
}

function readResponseMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (typeof record.message === "string") return record.message;
  const nested = record.data;
  if (nested && typeof nested === "object" && typeof (nested as Record<string, unknown>).message === "string") {
    return String((nested as Record<string, unknown>).message);
  }
  return null;
}

function readPostId(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const record = data as Record<string, unknown>;
  const nested = record.data;
  if (nested && typeof nested === "object") {
    const id = (nested as Record<string, unknown>).id;
    if (typeof id === "string" || typeof id === "number") return String(id);
  }
  const id = record.id;
  return typeof id === "string" || typeof id === "number" ? String(id) : "";
}

export async function createNuelinkSocialPost(params: {
  target: NuelinkSocialTarget;
  caption: string;
  link?: string | null;
  title?: string | null;
  alt?: string | null;
  mediaUrl?: string | null;
  publishMode?: NuelinkPublishMode | null;
  scheduledAt?: string | null;
}): Promise<NuelinkCreatePostResult> {
  const apiKey = readRequiredEnv("NUELINK_API_KEY");
  const brandId = readRequiredIntEnv("NUELINK_BRAND_ID");
  const collectionId = resolveCollectionId(params.target);
  const publishMode = resolvePublishMode(params.publishMode);
  const caption = params.caption.trim();

  if (!caption) throw new Error("Bitte zuerst einen Social-Text erfassen.");
  if (caption.length > 3000) throw new Error("Nuelink akzeptiert maximal 3000 Zeichen pro Beitrag.");

  const body: NuelinkCreatePostBody = { caption, publishMode };
  if (publishMode === "SCHEDULE") {
    body.scheduledAt = params.scheduledAt?.trim() || readRequiredEnv("NUELINK_SCHEDULED_AT");
  }
  if (params.link?.trim()) body.link = params.link.trim();
  if (params.title?.trim()) body.title = params.title.trim().slice(0, 255);
  if (params.alt?.trim()) body.alt = params.alt.trim().slice(0, 255);
  if (params.mediaUrl?.trim()) body.media = [{ url: params.mediaUrl.trim() }];

  const response = await fetch(`${NUELINK_API_BASE}/brands/${brandId}/collections/${collectionId}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message = readResponseMessage(data) ?? `Nuelink-Anfrage fehlgeschlagen (${response.status}).`;
    throw new NuelinkApiError(message, response.status);
  }

  const postId = readPostId(data);
  if (!postId) throw new Error("Nuelink hat keine Post-ID zurückgegeben.");

  return {
    postId,
    message: readResponseMessage(data),
    brandId,
    collectionId,
    publishMode,
    target: params.target,
  };
}

/** {@link createNuelinkSocialPost} with automatic retry on HTTP 429 / 5xx. */
export async function createNuelinkSocialPostWithRetry(
  params: Parameters<typeof createNuelinkSocialPost>[0],
): Promise<NuelinkCreatePostResult> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= NUELINK_RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await createNuelinkSocialPost(params);
    } catch (error) {
      lastError = error;
      if (!isRetryableNuelinkError(error) || attempt >= NUELINK_RETRY_DELAYS_MS.length) {
        throw error;
      }
      await sleep(NUELINK_RETRY_DELAYS_MS[attempt]);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Nuelink-Anfrage fehlgeschlagen.");
}
