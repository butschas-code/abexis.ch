import type { CmsSubmissionType } from "@/cms/types/enums";
import { siteConfig } from "@/data/pages";

const INBOX = siteConfig.emailPrimary;

/**
 * Sends a copy of public contact / Suchbrief submissions to the site inbox ({@link siteConfig.emailPrimary}).
 *
 * **Resend (preferred):** set `RESEND_API_KEY` and `RESEND_FROM` (verified sender in Resend).
 *
 * **Formspark:** if Resend is not configured, set `FORMSPARK_CONTACT_FORM_ID` to a form whose
 * dashboard notifications go to the same inbox (Formspark does not allow setting `to` per request).
 */
export async function notifySiteContactInbox(opts: {
  type: CmsSubmissionType;
  payload: Record<string, string>;
  fileUrls: string[];
}): Promise<void> {
  if (opts.type !== "contact" && opts.type !== "executive_search") return;

  const { payload, fileUrls } = opts;
  const bodyText = [
    `Eingang über abexis.ch (CMS)`,
    `Typ: ${opts.type}`,
    `Formular-ID: ${payload.formId ?? "—"}`,
    "",
    ...Object.entries(payload)
      .filter(([k]) => k !== "formId")
      .map(([k, v]) => `${k}: ${v}`),
    "",
    fileUrls.length ? `Dateien (URLs):\n${fileUrls.join("\n")}` : "Dateien: —",
  ].join("\n");

  const submitterEmail = payload.email?.trim();

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM?.trim();
  if (resendKey && resendFrom) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [INBOX],
        ...(submitterEmail ? { reply_to: submitterEmail } : {}),
        subject: `[abexis.ch] ${opts.type}: ${payload.name || payload.email || "Kontakt"}`,
        text: bodyText,
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("[notifySiteContactInbox] Resend failed:", res.status, err);
    }
    return;
  }

  const formsparkId = process.env.FORMSPARK_CONTACT_FORM_ID?.trim();
  if (formsparkId) {
    try {
      await fetch(`https://submit-form.com/${formsparkId}`, {
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
          "File URLs": fileUrls.length ? fileUrls.join("\n") : "—",
          "_email.from": submitterEmail || payload.name || "abexis.ch",
          "_email.subject": `[abexis.ch] ${opts.type}: ${payload.name || payload.email || "Kontakt"}`,
        }),
      });
    } catch (e) {
      console.error("[notifySiteContactInbox] Formspark failed:", e);
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.info(
      `[notifySiteContactInbox] No e-mail transport configured (Resend or FORMSPARK_CONTACT_FORM_ID). Inbox would be ${INBOX}.`,
    );
  }
}
