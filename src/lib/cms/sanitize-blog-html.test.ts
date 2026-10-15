import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sanitizeBlogHtml, sanitizeGeneratedBlogHtmlWithoutLinks } from "./sanitize-blog-html";

const FIREBASE_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/abexis.appspot.com/o/cms%2Fmedia%2Fblog-drafts%2Fabc%2Fbody%2Fablauf.png?alt=media&token=01234567-89ab-cdef-0123-456789abcdef";

describe("sanitizeGeneratedBlogHtmlWithoutLinks", () => {
  it("keeps editor-inserted image sources when stripping external citation URLs", () => {
    const html = [
      "<p>Mehr dazu unter https://example.com/report.</p>",
      `<img src="${FIREBASE_IMAGE}" alt="Vorgehen im Überblick" class="max-w-full h-auto" loading="lazy">`,
      "<p>Die acht Schritte bauen aufeinander auf.</p>",
    ].join("");

    const saved = sanitizeGeneratedBlogHtmlWithoutLinks(html);

    assert.match(saved, /firebasestorage\.googleapis\.com\/v0\/b\/abexis\.appspot\.com\/o\/cms%2Fmedia%2Fblog-drafts%2Fabc%2Fbody%2Fablauf\.png\?alt=media(?:&|&amp;)token=01234567-89ab-cdef-0123-456789abcdef/);
    assert.match(saved, /alt="Vorgehen im Überblick"/);
    assert.doesNotMatch(saved, /example\.com/);
  });

  it("keeps an image after the editor sanitizer and the draft save sanitizer", () => {
    const fromEditor = sanitizeBlogHtml(
      `<p>Text</p><img src="${FIREBASE_IMAGE}" alt="Ablauf" class="max-w-full h-auto rounded-xl my-4" loading="lazy">`,
    );
    const saved = sanitizeGeneratedBlogHtmlWithoutLinks(fromEditor);
    const reloaded = sanitizeBlogHtml(saved);

    assert.match(reloaded, /src="https:\/\/firebasestorage\.googleapis\.com\/[^"]+token=01234567-89ab-cdef-0123-456789abcdef"/);
    assert.match(reloaded, /alt="Ablauf"/);
  });

  it("drops scriptable image sources and still removes external links", () => {
    const saved = sanitizeGeneratedBlogHtmlWithoutLinks(
      '<p>Siehe <a href="https://example.com/quelle">diesen Bericht</a> und <a href="https://www.abexis.ch/kontakt">Kontakt</a>.</p><img src="javascript:alert(1)" alt="x"><img src=\'https://images.unsplash.com/photo-1?auto=format&fit=crop\' alt="Werkstatt" />',
    );

    assert.doesNotMatch(saved, /javascript:/i);
    assert.doesNotMatch(saved, /example\.com/);
    assert.match(saved, /href="\/kontakt"/);
    assert.match(saved, /src="https:\/\/images\.unsplash\.com\/photo-1\?auto=format(?:&|&amp;)fit=crop"/);
  });

  it("removes an image tag whose source was already wiped", () => {
    const saved = sanitizeBlogHtml('<p>Text</p><img alt="Vorgehen im Überblick" class="max-w-full" loading="lazy">');
    assert.doesNotMatch(saved, /<img/i);
    assert.match(saved, /<p>Text<\/p>/);
  });
});
