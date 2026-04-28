import type { CmsSubmissionType } from "@/cms/types/enums";
import { siteConfig } from "@/data/pages";

const INBOX = siteConfig.emailPrimary;

/**
 * Sends a copy of public contact / Suchbrief submissions to the site inbox ({@link siteConfig.emailPrimary}).
 *
 * **Formspark:** contact forms post to `FORMSPARK_CONTACT_FORM_ID` when set,
 * otherwise the Abexis contact form `sRnKB4pPD`. Enable Turnstile in that Formspark
 * form and set the matching Cloudflare secret key in the Formspark dashboard.
 */
export async function notifySiteContactInbox(opts: {
  type: CmsSubmissionType;
  payload: Record<string, string>;
  fileUrls: string[];
  turnstileToken?: string;
}): Promise<void> {
  if (opts.type !== "contact" && opts.type !== "executive_search") return;

  const { payload, fileUrls } = opts;
  const submitterEmail = payload.email?.trim();

  const formsparkId = process.env.FORMSPARK_CONTACT_FORM_ID?.trim() || "sRnKB4pPD";
  try {
    const res = await fetch(`https://submit-form.com/${formsparkId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        "Intended inbox (info)": INBOX,
        Type: opts.type,
        "Form ID": payload.formId ?? "",
        Name: payload.name ?? "",
        Company: payload.company ?? "",
        Email: payload.email ?? "",
        Phone: payload.phone ?? "",
        Message: payload.message ?? "",
        "File URLs": fileUrls.length ? fileUrls.join("\n") : "none",
        ...(opts.turnstileToken ? { "cf-turnstile-response": opts.turnstileToken } : {}),
        "_email.from": submitterEmail || payload.name || "abexis.ch",
        "_email.subject": `[abexis.ch] ${opts.type}: ${payload.name || payload.email || "Kontakt"}`,
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("[notifySiteContactInbox] Formspark failed:", res.status, err);
      throw new Error("FORMSPARK_CONTACT_FAILED");
    }
  } catch (e) {
    console.error("[notifySiteContactInbox] Formspark failed:", e);
    throw e;
  }
}
