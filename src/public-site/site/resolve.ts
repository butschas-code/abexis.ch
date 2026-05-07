import type { PublicDeploymentSite } from "./keys";
import { headers } from "next/headers";

const ENV_CMS_SITE = "NEXT_PUBLIC_CMS_SITE_ID" as const;

/**
 * **Config-first** deployment key : always `abexis` for this product (legacy `search` env value is ignored).
 */
export function getDeploymentSiteFromEnv(): PublicDeploymentSite {
  return "abexis";
}

/**
 * Request-aware resolution : aligns with {@link getDeploymentSiteFromEnv} (single-site CMS).
 */
export async function getResolvedPublicDeploymentSite(): Promise<PublicDeploymentSite> {
  try {
    await headers();
  } catch {
    /* `headers()` unavailable outside a request */
  }
  return "abexis";
}

/** @deprecated Host sniffing removed : single deployment. */
export function resolveDeploymentSiteFromHost(_host: string | null | undefined): PublicDeploymentSite | null {
  return null;
}
