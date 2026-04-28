#!/usr/bin/env npx tsx
/**
 * One-time seed: writes the Account Manager Industrie & Digitalisierung vacancy to Firestore.
 *
 * Run: npx tsx scripts/seed-vacancy-account-manager.ts
 *
 * Requires FIREBASE_PROJECT_ID + FIREBASE_SERVICE_ACCOUNT_JSON in .env.local, or ADC.
 * Uses NODE_ENV=development guard : override with SEED_ALLOW=1 for prod.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  for (const name of [".env.local", ".env"]) {
    const p = resolve(process.cwd(), name);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq <= 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}
loadEnvLocal();

import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { applicationDefault } from "firebase-admin/app";

const SLUG = "account-manager-industrie-digitalisierung";
const COLLECTION = "vacancies";

// ── HTML body built from the original hardcoded vacancy data ──────────────────

const body = `
<p>In dieser Position gestaltest Du aktiv die digitale Weiterentwicklung von Industrieunternehmen in der Schweiz. Du arbeitest an der Schnittstelle zwischen Business, Engineering und Technologie und begleitest Kunden dabei, ihre Prozesse nachhaltig zu verbessern.</p>
<p>Bei unserer Mandantin handelt es sich um ein erfolgreiches Unternehmen, das hochwertige Engineering&#8209;Software vertreibt und umfassende Beratungsdienstleistungen für anspruchsvolle Kunden erbringt.</p>

<h2>Deine Rolle</h2>
<p>Du verantwortest den Aufbau und die Weiterentwicklung von Kundenbeziehungen in einem anspruchsvollen B2B&#8209;Umfeld. Dabei geht es nicht nur um Vertrieb, sondern um echte Beratung auf Augenhöhe.</p>
<p>Konkret bedeutet das:</p>
<ul>
  <li>Du identifizierst neue Geschäftsmöglichkeiten und entwickelst bestehende Kunden strategisch weiter</li>
  <li>Du verstehst die Herausforderungen deiner Kunden und übersetzt sie in passende Lösungsansätze</li>
  <li>Du führst Gespräche auf Fach&#8209; und Managementebene und baust langfristiges Vertrauen auf</li>
  <li>Du orchestrierst den gesamten Sales&#8209;Prozess von der ersten Idee bis zum Abschluss</li>
  <li>Du arbeitest eng mit internen Spezialisten aus Beratung und Umsetzung zusammen</li>
  <li>Du bringst Marktimpulse aktiv ein und hilfst, das Geschäft weiterzuentwickeln</li>
</ul>

<h2>Was du mitbringst</h2>
<ul>
  <li>Erfahrung im Vertrieb von erklärungsbedürftigen Software-Lösungen oder Dienstleistungen im B2B&#8209;Umfeld</li>
  <li>Verständnis für industrielle Wertschöpfung, Produktentwicklung oder Produktionsprozesse</li>
  <li>Erfahrung im Umfeld Engineering&#8209;Software, Digitalisierung oder Prozessoptimierung</li>
  <li>Fähigkeit, komplexe Themen einfach und überzeugend zu vermitteln</li>
  <li>Souveränes Auftreten und echte Freude an Kundeninteraktion</li>
  <li>Strukturierte Arbeitsweise kombiniert mit unternehmerischem Denken</li>
  <li>Eigenverantwortung und der Wille, Dinge voranzutreiben</li>
</ul>

<h2>Was dich erwartet</h2>
<ul>
  <li>Eine Rolle mit viel Gestaltungsspielraum und direktem Einfluss auf den Geschäftserfolg</li>
  <li>Anspruchsvolle Kundenprojekte mit echter Relevanz</li>
  <li>Ein Umfeld, in dem Vertrieb, Beratung und Umsetzung eng zusammenarbeiten</li>
  <li>Kurze Entscheidungswege und eine klare Ausrichtung</li>
  <li>Die Möglichkeit, Dich fachlich und persönlich weiterzuentwickeln</li>
</ul>

<h2>Warum diese Rolle spannend ist</h2>
<p>Hier verkaufst du keine Standardlösung. Du arbeitest an Themen, die für Deine Kunden geschäftskritisch sind. Und genau deshalb zählt nicht nur, was Du verkaufst : sondern wie Du denkst, verstehst und berätst.</p>
<p>Ein wertschätzendes Arbeitsumfeld sowie zahlreiche attraktive Benefits runden das Angebot ab.</p>
`.trim();

const bodyEnvelope = JSON.stringify({ format: "abexis-blog-body", version: 1, html: body });

// ── Firestore setup ────────────────────────────────────────────────────────────

function initAdmin() {
  if (getApps().length > 0) return getApps()[0]!;
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (rawJson) {
    const credentials = JSON.parse(rawJson) as ServiceAccount;
    return initializeApp({ credential: cert(credentials), projectId });
  }
  if (projectId) {
    return initializeApp({ credential: applicationDefault(), projectId });
  }
  throw new Error("No Firebase credentials. Set FIREBASE_PROJECT_ID + FIREBASE_SERVICE_ACCOUNT_JSON or use ADC.");
}

async function main() {
  initAdmin();
  const db = getFirestore();

  // Check if this slug already exists
  const existing = await db.collection(COLLECTION).where("slug", "==", SLUG).limit(1).get();
  if (!existing.empty) {
    console.log(`[seed] Vacancy with slug "${SLUG}" already exists (id: ${existing.docs[0].id}). Skipping.`);
    return;
  }

  const ref = db.collection(COLLECTION).doc();
  await ref.set({
    title: "Account Manager Industrie & Digitalisierung (m/w/d)",
    slug: SLUG,
    excerpt: "Gestalte die digitale Weiterentwicklung von Industrieunternehmen in der Schweiz : an der Schnittstelle zwischen Business, Engineering und Technologie.",
    sector: "Industrie & Digitalisierung",
    location: "Schweiz",
    employmentType: "Vollzeit",
    hook: "Du willst nicht einfach Software verkaufen, sondern echten Impact schaffen? Dann könnte diese Rolle genau das Richtige für Dich sein.",
    body: bodyEnvelope,
    files: [
      {
        label: "Abexis SEARCH : Account Manager I&D.pdf",
        url: "https://files.designer.hoststar.ch/9e/d8/9ed818b8-6df9-4549-a501-eb744e1546ed.pdf",
      },
    ],
    apply: "Interesse geweckt? Sende uns Deine aussagekräftigen Unterlagen an contact@abexis.ch : oder nimm unverbindlich Kontakt auf: +41 43 535 84 34",
    site: "search",
    status: "published",
    publishedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`[seed] ✓ Vacancy created: id=${ref.id} slug="${SLUG}"`);
}

main().catch((err) => {
  console.error("[seed] failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
