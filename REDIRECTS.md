# URL- und Redirect-Map (Abexis Consulting, abexis.ch)

Dieses Redesign behält die zentralen Legacy-Pfade bei, damit bestehende Links und Suchmaschinen-Signale erhalten bleiben.

## Keine Redirects erforderert (1:1 beibehalten)

- `/` : Startseite
- `/fokusthemen/digitale-transformation`
- `/fokusthemen/unternehmensstrategie`
- `/fokusthemen/vertriebmarketing`
- `/fokusthemen/veränderungsmanagement` (Umlaut-URL wie bisher)
- `/fokusthemen/prozessoptimierung`
- `/fokusthemen/projektmanagement`
- `/blog` und sämtliche `/blog/…` Artikel-Slugs (inkl. URL-kodierte Umlaute)
- `/projectfitcheck`
- `/termin`
- `/legal-policy` (Impressum)
- `/privacy-policy` (Datenschutzerklärung)
- Team-/Profilseiten: `/danielsengstag`, `/christophwainig`, `/katrinyuan`, `/sergegarazi`, `/williamdemaeyer`
- `/en/home` : englische Startseite (Inhalt übernommen)

## Neue informative Routen (Zusatz, ohne Legacy zu ersetzen)

- `/leistungen` : redaktionelle Übersicht der Beratungsthemen (verlinkt auf die bestehenden Fokusthemen-URLs)
- `/leistungen/executive-search` : kurze Referenzseite mit Link zu `https://abexis-search.ch` (Executive Search bleibt strategisch getrennt)
- `/ueber-uns` : gebündelte Darstellung von «Über uns» inkl. Team (Originalseiten bleiben zusätzlich erreichbar)
- `/kontakt` : Kontaktüberblick (Kontaktdaten identisch zu Footer / bisheriger Website)

Falls später Pfade umbenannt werden, hier dokumentierte 301-Redirects in `next.config.ts` ergänzen.
