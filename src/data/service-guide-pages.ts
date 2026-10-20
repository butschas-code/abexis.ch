export type ServiceGuideLocale = "de" | "en";
export type ServiceGuideParent =
  | "digitale-transformation"
  | "unternehmensstrategie"
  | "vertriebmarketing"
  | "veränderungsmanagement"
  | "prozessoptimierung"
  | "projektmanagement"
  | "risikomanagement"
  | "executive-search";

export type ServiceGuidePage = {
  parent: ServiceGuideParent;
  slug: string;
  locale: ServiceGuideLocale;
  meta: { title: string; excerpt: string };
  eyebrow: string;
  title: string;
  lead: string;
  answer: { title: string; body: string };
  sections: readonly { title: string; body: string; points?: readonly string[] }[];
  faq: readonly { q: string; a: string }[];
  closing: { title: string; body: string; cta: string };
};

const de: ServiceGuidePage[] = [
  {
    parent: "digitale-transformation", slug: "digitalisierungsstrategie-kmu", locale: "de",
    meta: { title: "Digitalisierungsstrategie für KMU in der Schweiz", excerpt: "Wie Schweizer KMU eine umsetzbare Digitalisierungsstrategie entwickeln: Ziele, Prioritäten, Roadmap, Governance und messbarer Nutzen." },
    eyebrow: "Digitale Transformation",
    title: "Digitalisierungsstrategie für KMU: vom Potenzial zur Roadmap",
    lead: "Eine Digitalisierungsstrategie verbindet Geschäftsziele mit konkreten Veränderungen in Prozessen, Daten, Organisation und Technologie. Sie schafft Prioritäten, bevor einzelne Tools oder Projekte Ressourcen binden.",
    answer: { title: "Was gehört in eine Digitalisierungsstrategie?", body: "Eine belastbare Digitalisierungsstrategie beschreibt den geschäftlichen Nutzen, die wichtigsten Handlungsfelder, eine priorisierte Roadmap, Verantwortlichkeiten und messbare Ergebnisse. Für KMU ist entscheidend, wenige wirksame Vorhaben konsequent umzusetzen, statt eine lange Technologieliste zu erstellen." },
    sections: [
      { title: "Mit Geschäftsfragen statt Technologien starten", body: "Ausgangspunkt sind Kundenbedürfnisse, Kosten, Qualität, Geschwindigkeit oder neue Geschäftsmodelle. Erst wenn der gewünschte Effekt klar ist, lässt sich beurteilen, wo Daten, Automatisierung, Cloud oder KI sinnvoll beitragen.", points: ["Ziele und erwarteten Nutzen festlegen", "Kunden- und Prozessprobleme sichtbar machen", "Bestehende Fähigkeiten und Systeme einordnen"] },
      { title: "Vorhaben nach Wirkung und Machbarkeit priorisieren", body: "Nicht jede gute Idee gehört sofort auf die Roadmap. Abhängigkeiten, Datenqualität, interne Kapazität, Risiken und erwarteter Nutzen bestimmen die Reihenfolge. Ein sinnvoller erster Schritt liefert einen sichtbaren Effekt und schafft Grundlagen für weitere Etappen." },
      { title: "Umsetzung und Steuerung mitdenken", body: "Die Strategie wird erst durch klare Verantwortungen, Entscheidungswege, Budgets und Erfolgskriterien wirksam. Regelmässige Reviews prüfen, ob Projekte den erwarteten Nutzen liefern oder angepasst werden müssen." },
    ],
    faq: [
      { q: "Wie lange dauert die Entwicklung einer Digitalisierungsstrategie?", a: "Für ein klar abgegrenztes KMU kann eine erste belastbare Roadmap oft innerhalb weniger Wochen entstehen. Dauer und Tiefe hängen von Geschäftsbereichen, Systemlandschaft und verfügbarer Entscheidungsgrundlage ab." },
      { q: "Braucht eine Digitalisierungsstrategie bereits konkrete Software?", a: "Nein. Zuerst sollten Ziele, Anwendungsfälle und Anforderungen klar sein. Produkte und Anbieter lassen sich danach gezielter bewerten." },
      { q: "Wie wird aus der Strategie Umsetzung?", a: "Durch priorisierte Initiativen mit Verantwortlichen, Ressourcen, Entscheidungsterminen und messbaren Ergebnissen. Die Roadmap muss regelmässig überprüft werden." },
    ],
    closing: { title: "Bringen Sie Priorität in Ihre digitale Roadmap.", body: "Abexis verbindet strategische Klärung mit realistischer Umsetzung und Projektführung.", cta: "Digitalisierungsstrategie besprechen" },
  },
  {
    parent: "unternehmensstrategie", slug: "strategieprozess-kmu", locale: "de",
    meta: { title: "Strategieprozess für KMU: Entwicklung und Umsetzung", excerpt: "Ein klarer Strategieprozess für Schweizer KMU: Ausgangslage, Optionen, Entscheidungen, Umsetzung und wirksame Überprüfung." },
    eyebrow: "Unternehmensstrategie",
    title: "Strategieprozess für KMU: klare Entscheidungen statt Strategiepapier",
    lead: "Ein wirksamer Strategieprozess schafft Orientierung darüber, wo ein Unternehmen gewinnen will, worauf es verzichtet und welche Fähigkeiten für die Umsetzung aufgebaut werden müssen.",
    answer: { title: "Wie läuft ein Strategieprozess ab?", body: "Ein Strategieprozess verbindet Situationsanalyse, Zukunftsbild, strategische Optionen, verbindliche Entscheidungen und Umsetzung. Entscheidend ist nicht die Präsentation, sondern dass Prioritäten, Verantwortungen, Ressourcen und eine regelmässige Fortschrittskontrolle zusammenpassen." },
    sections: [
      { title: "Ausgangslage und Annahmen offenlegen", body: "Markt, Kunden, Wettbewerb, Fähigkeiten und finanzielle Spielräume werden gemeinsam betrachtet. Dabei geht es nicht um Vollständigkeit, sondern um die wenigen Faktoren, die Entscheidungen tatsächlich verändern." },
      { title: "Optionen entwickeln und echte Entscheidungen treffen", body: "Gute Strategie benennt Alternativen und Zielkonflikte. Geschäftsleitung und Verwaltungsrat müssen festlegen, welche Kundengruppen, Leistungen und Fähigkeiten Priorität haben – und was bewusst nicht verfolgt wird.", points: ["Strategische Leitplanken", "Bewertete Handlungsoptionen", "Klare Prioritäten und Verzichtsentscheide", "Messbare strategische Ziele"] },
      { title: "Strategie in Führung und Umsetzung übersetzen", body: "Massnahmen, Budgets und Verantwortlichkeiten werden in die operative Planung überführt. Ein kompakter Review-Rhythmus macht sichtbar, ob Annahmen noch gelten und die Organisation tatsächlich in die vereinbarte Richtung arbeitet." },
    ],
    faq: [
      { q: "Wer sollte am Strategieprozess teilnehmen?", a: "Typischerweise Eigentümer, Verwaltungsrat und Geschäftsleitung in klar definierten Rollen. Für einzelne Themen werden Markt-, Kunden- oder Fachexperten gezielt einbezogen." },
      { q: "Wie oft sollte die Strategie überprüft werden?", a: "Die Umsetzung sollte mehrmals pro Jahr überprüft werden. Eine grundlegende Neubewertung ist sinnvoll, wenn Markt, Eigentümerziele oder wesentliche Annahmen sich verändern." },
      { q: "Was ist das wichtigste Ergebnis?", a: "Ein gemeinsames, entscheidungsfähiges Zielbild mit wenigen Prioritäten, klaren Verantwortungen und einer umsetzbaren Agenda." },
    ],
    closing: { title: "Machen Sie strategische Prioritäten entscheidbar.", body: "Abexis strukturiert den Prozess, fordert Annahmen heraus und begleitet die Übersetzung in konkrete Umsetzung.", cta: "Strategieprozess besprechen" },
  },
  {
    parent: "vertriebmarketing", slug: "b2b-vertriebsstrategie", locale: "de",
    meta: { title: "B2B-Vertriebsstrategie entwickeln und umsetzen", excerpt: "B2B-Vertriebsstrategie für Schweizer Unternehmen: Zielkunden, Nutzenversprechen, Vertriebsprozess, Steuerung und Umsetzung klar ausrichten." },
    eyebrow: "Vertrieb und Marketing",
    title: "B2B-Vertriebsstrategie: Fokus für Markt, Kunden und Pipeline",
    lead: "Eine B2B-Vertriebsstrategie legt fest, welche Kunden mit welchem Nutzenversprechen über welche Vertriebswege gewonnen und entwickelt werden sollen. Sie verbindet Marktentscheidungen mit dem Arbeitsalltag des Vertriebsteams.",
    answer: { title: "Was macht eine B2B-Vertriebsstrategie wirksam?", body: "Sie definiert attraktive Zielsegmente, relevante Kundenprobleme, ein differenziertes Nutzenversprechen, klare Vertriebswege und einen steuerbaren Prozess. Rollen, CRM, Kennzahlen und Führung müssen diese Entscheidungen unterstützen, sonst bleibt die Strategie ein Dokument." },
    sections: [
      { title: "Zielkunden und Potenzial schärfen", body: "Nicht jeder erreichbare Kunde ist gleich attraktiv. Segmentierung, Kundenwert und reale Abschlusschancen helfen, knappe Vertriebszeit dort einzusetzen, wo Bedarf, Zugang und strategische Passung zusammenkommen." },
      { title: "Vom Nutzenversprechen zum Vertriebsprozess", body: "Der Prozess beschreibt, wie Interesse entsteht, Bedarf qualifiziert, eine Lösung entwickelt und eine Entscheidung begleitet wird. Marketing, Verkauf und Delivery benötigen gemeinsame Definitionen für Übergaben und nächste Schritte.", points: ["Zielsegmente und Buying Center", "Nutzenargumentation und Referenzfälle", "Qualifizierung und Pipeline-Stufen", "Verantwortung für Übergaben und Follow-up"] },
      { title: "Mit wenigen Kennzahlen konsequent steuern", body: "Pipeline-Volumen allein reicht nicht. Aussagekräftig sind unter anderem Conversion, Zeit pro Phase, Gründe für verlorene Chancen und Qualität der nächsten Schritte. Führung nutzt diese Daten für Entscheidungen, nicht für Reporting um seiner selbst willen." },
    ],
    faq: [
      { q: "Was ist der Unterschied zwischen Vertriebsstrategie und Vertriebstraining?", a: "Die Strategie gestaltet Zielmarkt, Angebot, Prozess und Steuerung. Training entwickelt Fähigkeiten innerhalb dieses Systems. Ohne klare Strategie trainiert das Team möglicherweise für die falschen Kunden oder Aktivitäten." },
      { q: "Welche Rolle spielt das CRM?", a: "Das CRM unterstützt einen vereinbarten Vertriebsprozess und schafft Transparenz. Es ersetzt weder Segmentierung noch Führungsentscheidungen." },
      { q: "Wann sollte eine Vertriebsstrategie überarbeitet werden?", a: "Bei neuen Märkten oder Angeboten, stagnierender Pipeline, langen Verkaufszyklen, niedriger Abschlussquote oder unklarer Aufgabenverteilung zwischen Marketing und Vertrieb." },
    ],
    closing: { title: "Richten Sie Vertriebsarbeit auf die richtigen Chancen aus.", body: "Abexis verbindet Marktlogik, Vertriebsorganisation und messbare Umsetzung.", cta: "Vertriebsstrategie besprechen" },
  },
  {
    parent: "veränderungsmanagement", slug: "change-management-vorgehen", locale: "de",
    meta: { title: "Change Management: Vorgehen für wirksame Veränderung", excerpt: "Change Management strukturiert planen: Führung, Stakeholder, Kommunikation, Befähigung und Verankerung in einem umsetzbaren Vorgehen." },
    eyebrow: "Veränderungsmanagement",
    title: "Change Management: Veränderung führen und im Alltag verankern",
    lead: "Change Management schafft die organisatorischen Voraussetzungen, damit neue Strategien, Prozesse oder Systeme tatsächlich genutzt werden. Im Mittelpunkt stehen Führung, Beteiligung, Befähigung und sichtbare Entscheidungen.",
    answer: { title: "Was gehört zu einem Change-Management-Vorgehen?", body: "Ein wirksames Vorgehen klärt Ziel und Auswirkungen, identifiziert betroffene Gruppen, stärkt Sponsoren und Führungskräfte, plant Kommunikation und Befähigung und misst die tatsächliche Anwendung. Change Management läuft parallel zur fachlichen Umsetzung, nicht erst kurz vor dem Go-live." },
    sections: [
      { title: "Auswirkungen konkret statt allgemein beschreiben", body: "Menschen müssen verstehen, was sich für ihre Aufgaben, Entscheidungen und Zusammenarbeit ändert. Eine Change-Analyse macht Unterschiede zwischen Bereichen und Rollen sichtbar und verhindert eine einheitliche Kommunikation für sehr verschiedene Situationen." },
      { title: "Führung und Beteiligung organisieren", body: "Sponsoren geben Richtung und treffen sichtbare Entscheidungen. Führungskräfte übersetzen die Veränderung in den Alltag. Key User und betroffene Mitarbeitende helfen, Risiken und praktische Hürden früh zu erkennen.", points: ["Klares Sponsor- und Führungsmodell", "Stakeholder- und Auswirkungsanalyse", "Dialog und Feedbackkanäle", "Rollenbezogene Befähigung"] },
      { title: "Nutzung und Verankerung messen", body: "Teilnahme an Schulungen ist noch keine Adoption. Entscheidend ist, ob neue Abläufe korrekt angewendet, alte Wege beendet und gewünschte Ergebnisse erreicht werden. Beobachtungen und Kennzahlen steuern gezielte Nacharbeit." },
    ],
    faq: [
      { q: "Wann sollte Change Management beginnen?", a: "Sobald Zielbild und wesentliche Auswirkungen erkennbar sind. Frühe Einbindung verbessert Planung und Glaubwürdigkeit; konkrete Massnahmen werden mit dem Projektfortschritt verfeinert." },
      { q: "Ist Kommunikation gleich Change Management?", a: "Nein. Kommunikation ist ein Teil. Ebenso wichtig sind Führung, Beteiligung, Befähigung, Anpassung von Rollen und die Verankerung im Arbeitsalltag." },
      { q: "Wie lässt sich der Erfolg messen?", a: "Über Nutzung neuer Prozesse oder Systeme, Qualität der Ergebnisse, Verhaltensindikatoren, Feedback und das Erreichen der geschäftlichen Zielsetzung." },
    ],
    closing: { title: "Machen Sie Veränderung im Alltag wirksam.", body: "Abexis verbindet Veränderungsarchitektur mit Projektführung und konkreter Umsetzung.", cta: "Change-Vorhaben besprechen" },
  },
  {
    parent: "prozessoptimierung", slug: "prozesse-analysieren-optimieren", locale: "de",
    meta: { title: "Prozesse analysieren und nachhaltig optimieren", excerpt: "Geschäftsprozesse systematisch analysieren und optimieren: Ziele, Engpässe, Verantwortungen, Automatisierung und messbare Verbesserung." },
    eyebrow: "Prozessoptimierung",
    title: "Prozesse analysieren und optimieren: Wirkung vor Aktivität",
    lead: "Prozessoptimierung verbessert Durchlaufzeit, Qualität, Kosten oder Kundenerlebnis. Sie beginnt mit einem klaren Ziel und realen Prozessdaten – nicht mit der möglichst detaillierten Dokumentation jedes Ablaufs.",
    answer: { title: "Wie werden Geschäftsprozesse sinnvoll optimiert?", body: "Zuerst werden Ziel, Prozessgrenzen und relevante Kennzahlen festgelegt. Danach werden Ist-Ablauf, Engpässe, Fehler, Wartezeiten und Verantwortungen analysiert. Verbesserungen werden nach Wirkung und Aufwand priorisiert, getestet und mit klarer Prozessverantwortung verankert." },
    sections: [
      { title: "Den richtigen Prozess und das richtige Ziel wählen", body: "Ein Prozess eignet sich für die Optimierung, wenn sein Problem geschäftlich relevant und beeinflussbar ist. Kundenbeschwerden, lange Durchlaufzeiten, Qualitätsmängel oder hohe manuelle Aufwände liefern konkrete Ausgangspunkte." },
      { title: "Ist-Prozess gemeinsam sichtbar machen", body: "Workshops, Beobachtung und Daten zeigen, wie der Ablauf tatsächlich funktioniert. Mitarbeitende kennen Umwege, Doppelarbeit und Ausnahmen. Diese Erfahrung gehört in die Analyse, bevor ein Soll-Prozess entworfen wird.", points: ["Prozessgrenzen und Kundenergebnis", "Schritte, Rollen und Übergaben", "Engpässe, Schleifen und Fehler", "Systeme, Daten und manuelle Arbeit"] },
      { title: "Verbessern, testen und Verantwortung klären", body: "Nicht jede Schwachstelle verlangt Automatisierung. Oft helfen klare Entscheidungen, vereinfachte Übergaben oder weniger Varianten. Änderungen werden mit einem messbaren Ziel pilotiert; Prozessverantwortliche sichern die Weiterentwicklung." },
    ],
    faq: [
      { q: "Muss jeder Prozess vollständig dokumentiert werden?", a: "Nein. Die notwendige Tiefe richtet sich nach Problem und Entscheidung. Für einen Engpass genügt oft eine fokussierte End-to-End-Sicht mit belastbaren Daten." },
      { q: "Wann lohnt sich Automatisierung?", a: "Wenn ein stabiler, wiederholbarer Ablauf mit ausreichendem Volumen vorliegt und die Automatisierung einen messbaren Nutzen bringt. Einen unklaren Prozess zu automatisieren verfestigt häufig das Problem." },
      { q: "Wer sollte beteiligt sein?", a: "Prozessverantwortliche, ausführende Mitarbeitende, betroffene Schnittstellen und bei Bedarf IT, Compliance oder Kundenvertreter." },
    ],
    closing: { title: "Verbessern Sie dort, wo Wirkung entsteht.", body: "Abexis schafft Transparenz, priorisiert die richtigen Hebel und begleitet die Umsetzung.", cta: "Prozessoptimierung besprechen" },
  },
  {
    parent: "projektmanagement", slug: "projekt-in-schieflage", locale: "de",
    meta: { title: "Projekt in Schieflage: erkennen, stabilisieren, neu ausrichten", excerpt: "Was tun, wenn ein Projekt in Schieflage gerät? Warnsignale erkennen, Lage objektiv beurteilen, Entscheidungen treffen und Umsetzung stabilisieren." },
    eyebrow: "Projektmanagement",
    title: "Projekt in Schieflage: Klarheit vor Aktionismus",
    lead: "Ein kritisches Projekt braucht zuerst ein belastbares Lagebild. Zusätzliche Meetings, neue Listen oder mehr Druck helfen wenig, wenn Ziele, Entscheidungen, Verantwortungen oder Risiken ungeklärt bleiben.",
    answer: { title: "Wie lässt sich ein Projekt in Schieflage stabilisieren?", body: "Die Stabilisierung beginnt mit einer unabhängigen Bestandsaufnahme von Ziel, Scope, Fortschritt, Risiken, Governance und Teamdynamik. Danach werden wenige Sofortmassnahmen, notwendige Managemententscheidungen und ein realistischer Plan vereinbart. Transparenz ist wichtiger als ein künstlich beruhigter Statusbericht." },
    sections: [
      { title: "Warnsignale ernst nehmen", body: "Wiederholt vertagte Entscheidungen, wechselnde Prioritäten, sinkendes Vertrauen, unklare Verantwortungen oder ein Status, der nicht zu den beobachteten Ergebnissen passt, zeigen Steuerungsbedarf. Frühzeitige Klärung erweitert den Handlungsspielraum." },
      { title: "Lagebild und Ursachen trennen", body: "Ein Review prüft Dokumente, Ergebnisse und Aussagen wichtiger Beteiligter. Symptome wie Terminverzug werden von Ursachen wie unklarem Scope, fehlender Entscheidungskraft oder unrealistischer Ressourcenplanung getrennt.", points: ["Ziel, Nutzen und Erfolgskriterien", "Lieferumfang und tatsächlicher Fortschritt", "Risiken, Abhängigkeiten und Entscheidungen", "Governance, Rollen und Zusammenarbeit"] },
      { title: "Stabilisierung verbindlich steuern", body: "Massnahmen brauchen Eigentümer, Termine und klare Entscheidungspunkte. Je nach Lage wird der Umfang reduziert, Governance angepasst, Führung verstärkt oder ein Turnaround-Plan aufgesetzt. Fortschritt wird an Ergebnissen gemessen." },
    ],
    faq: [
      { q: "Wann gilt ein Projekt als kritisch?", a: "Nicht erst bei Termin- oder Budgetüberschreitung. Kritisch ist ein Projekt auch, wenn Nutzen, Entscheidungsfähigkeit oder Vertrauen erkennbar gefährdet sind." },
      { q: "Hilft ein unabhängiges Projektaudit?", a: "Ja, wenn interne Berichte kein gemeinsames Lagebild mehr schaffen oder Beteiligte stark in bestehende Positionen gebunden sind. Das Audit muss auf Entscheidungen und Handlungen ausgerichtet sein." },
      { q: "Muss die Projektleitung ersetzt werden?", a: "Nicht automatisch. Zuerst werden Ursachen und Rollen geklärt. Manchmal braucht es zusätzliche Kapazität, klarere Governance oder konkrete Managemententscheide statt eines Personalwechsels." },
    ],
    closing: { title: "Schaffen Sie ein belastbares Lagebild.", body: "Der Abexis Project Reality Check zeigt priorisierte Risiken, Entscheidungsbedarf und konkrete nächste Schritte.", cta: "Project Reality Check besprechen" },
  },
  {
    parent: "risikomanagement", slug: "projektrisiken-frueh-erkennen", locale: "de",
    meta: { title: "Projektrisiken früh erkennen und wirksam steuern", excerpt: "Projektrisiken früh erkennen, priorisieren und steuern: Risikoanalyse, Verantwortungen, Frühindikatoren und unabhängige Risikobegleitung." },
    eyebrow: "Risikomanagement",
    title: "Projektrisiken früh erkennen: von der Liste zur Entscheidung",
    lead: "Risikomanagement schützt nicht vor jeder Überraschung. Es sorgt dafür, dass relevante Unsicherheiten früh sichtbar werden, Verantwortliche handeln und Führungsgremien rechtzeitig entscheiden können.",
    answer: { title: "Wie werden Projektrisiken wirksam gesteuert?", body: "Risiken werden konkret als mögliches Ereignis mit Ursache und Auswirkung beschrieben, nach Eintrittswahrscheinlichkeit und Tragweite priorisiert und einer verantwortlichen Person zugeordnet. Frühindikatoren, Massnahmen und Entscheidungstermine machen aus einer Risikoliste ein Führungsinstrument." },
    sections: [
      { title: "Risiken konkret und entscheidbar formulieren", body: "Begriffe wie «Ressourcen» oder «Schnittstelle» sind noch keine Risikoaussage. Erst Ursache, mögliches Ereignis und Auswirkung zeigen, worauf eine Massnahme zielen muss und wer entscheiden kann." },
      { title: "Priorität und Frühindikatoren festlegen", body: "Die Bewertung berücksichtigt neben Wahrscheinlichkeit und Schaden auch zeitliche Nähe, Erkennbarkeit und Abhängigkeiten. Messbare Indikatoren zeigen, wann Beobachtung nicht mehr genügt und eine Eskalation erforderlich wird.", points: ["Eindeutige Risikobeschreibung", "Bewertung und Priorisierung", "Eigentümer und Massnahmen", "Frühindikatoren und Eskalationsweg"] },
      { title: "Unabhängige Sicht in der Steuerung sichern", body: "Projektteams stehen unter Lieferdruck und gewöhnen sich an bekannte Risiken. Ein externer Risk Manager hinterfragt Veränderungen, prüft die Wirksamkeit von Massnahmen und berichtet adressatengerecht an Projektleitung oder Steuerungsgremium." },
    ],
    faq: [
      { q: "Wie oft sollten Projektrisiken überprüft werden?", a: "So häufig, wie sich das Projekt und seine Entscheidungszyklen verändern. Kritische Risiken gehören in jeden relevanten Steuerungstermin; das Gesamtbild wird regelmässig neu bewertet." },
      { q: "Was ist der Unterschied zwischen Problem und Risiko?", a: "Ein Risiko kann künftig eintreten; ein Problem ist bereits eingetreten. Beides braucht Verantwortung, aber unterschiedliche Massnahmen und Kommunikation." },
      { q: "Wann lohnt sich ein externer Risk Manager?", a: "Bei hoher Tragweite, komplexen Abhängigkeiten, knapper interner Kapazität oder wenn Gremien eine unabhängige Sicht auf Risiken und Massnahmen benötigen." },
    ],
    closing: { title: "Machen Sie Risiken zu steuerbaren Entscheidungen.", body: "Abexis bietet punktuelle Standortbestimmung oder laufende unabhängige Risikobegleitung.", cta: "Risikobegleitung besprechen" },
  },
  {
    parent: "executive-search", slug: "fuehrungskraefte-finden", locale: "de",
    meta: { title: "Führungskräfte finden mit Executive Search in der Schweiz", excerpt: "Wie Executive Search in der Schweiz funktioniert: Anforderungsprofil, Marktansprache, Auswahl, Vertraulichkeit und erfolgreiche Besetzung." },
    eyebrow: "Executive Search Schweiz",
    title: "Führungskräfte finden: diskret, strukturiert und passgenau",
    lead: "Executive Search erschliesst auch Kandidatinnen und Kandidaten, die nicht aktiv suchen. Eine erfolgreiche Besetzung beginnt mit Klarheit über Auftrag, Wirkung, Umfeld und die Anforderungen jenseits des Lebenslaufs.",
    answer: { title: "Wann ist Executive Search sinnvoll?", body: "Executive Search eignet sich für Führungs- und Schlüsselpositionen, bei denen der erreichbare Bewerbermarkt zu klein ist, Vertraulichkeit wichtig ist oder Branchen- und Führungserfahrung präzise passen müssen. Die Suche kombiniert Marktanalyse, diskrete Direktansprache und strukturierte Beurteilung." },
    sections: [
      { title: "Rolle und Erfolg vor der Suche klären", body: "Ein Stellenprofil allein reicht nicht. Entscheidend sind Auftrag, erwartete Ergebnisse, Entscheidungsbefugnisse, Führungssituation, Kultur und die Herausforderungen der ersten zwölf Monate." },
      { title: "Den relevanten Markt systematisch erschliessen", body: "Aus Zielbranchen, Unternehmen, Funktionen und Erfahrungen entsteht eine Suchstrategie. Direktansprache erreicht qualifizierte Personen unabhängig davon, ob sie auf Stellenplattformen aktiv sind. Vertraulichkeit und respektvolle Kommunikation prägen den Prozess.", points: ["Auftrags- und Kompetenzprofil", "Zielmarkt und Research", "Diskrete Direktansprache", "Strukturierte Interviews und Referenzen"] },
      { title: "Passung fundiert beurteilen", body: "Fachliche Erfahrung ist nur ein Teil. Motivation, Führungsverhalten, Lernfähigkeit und Anschluss an die konkrete Organisation werden anhand vergleichbarer Kriterien beurteilt. Der Auftraggeber erhält eine nachvollziehbare Entscheidungsgrundlage." },
    ],
    faq: [
      { q: "Was unterscheidet Executive Search von klassischer Personalvermittlung?", a: "Executive Search arbeitet mandatsbezogen, recherchiert den relevanten Markt aktiv und spricht passende Personen direkt an. Der Prozess ist besonders auf anspruchsvolle, vertrauliche oder schwer erreichbare Profile ausgerichtet." },
      { q: "Wie lange dauert eine Suche?", a: "Die Dauer hängt von Rolle, Markt und Entscheidungsprozess ab. Ein klarer Auftrag, schnelle Rückmeldungen und verbindliche Interviewtermine verkürzen die Besetzung deutlich." },
      { q: "Können verdeckte Mandate bearbeitet werden?", a: "Ja. Vertraulichkeit, Informationsumfang und Ansprache werden vor Beginn klar vereinbart und während des gesamten Prozesses geschützt." },
    ],
    closing: { title: "Klären Sie Ihre nächste Schlüsselbesetzung.", body: "Abexis SEARCH verbindet fundierte Marktansprache mit eigener Führungs- und Branchenerfahrung.", cta: "Suchmandat besprechen" },
  },
];

const translations: Record<ServiceGuideParent, Omit<ServiceGuidePage, "parent" | "slug" | "locale">> = {
  "digitale-transformation": {
    meta: { title: "Digital Strategy for Swiss SMEs", excerpt: "How Swiss SMEs build an actionable digital strategy: objectives, priorities, roadmap, governance and measurable value." }, eyebrow: "Digital transformation", title: "Digital strategy for SMEs: from opportunity to roadmap", lead: "A digital strategy connects business objectives with concrete changes to processes, data, organisation and technology. It creates priorities before individual tools or projects consume resources.",
    answer: { title: "What belongs in a digital strategy?", body: "A robust digital strategy defines business value, the most important fields of action, a prioritised roadmap, responsibilities and measurable outcomes. For SMEs, the key is to execute a small number of high-impact initiatives consistently rather than produce a long technology list." },
    sections: [
      { title: "Start with business questions, not technology", body: "Customer needs, cost, quality, speed or new business models form the starting point. Once the intended effect is clear, the role of data, automation, cloud or AI can be assessed realistically.", points: ["Define objectives and expected value", "Make customer and process problems visible", "Assess current capabilities and systems"] },
      { title: "Prioritise by impact and feasibility", body: "Not every good idea belongs on the immediate roadmap. Dependencies, data quality, internal capacity, risk and expected value determine the sequence. A useful first step delivers visible value and creates foundations for later stages." },
      { title: "Design governance and execution together", body: "Strategy becomes effective through clear ownership, decision paths, budgets and success criteria. Regular reviews test whether initiatives deliver value or need to be adapted." },
    ], faq: [
      { q: "How long does a digital strategy take to develop?", a: "For a clearly bounded SME, an initial defensible roadmap can often be developed within a few weeks. Duration and depth depend on business scope, systems and available decision evidence." },
      { q: "Does a digital strategy need specific software choices?", a: "No. Objectives, use cases and requirements should come first. Products and vendors can then be assessed more precisely." },
      { q: "How does strategy turn into execution?", a: "Through prioritised initiatives with owners, resources, decision dates and measurable outcomes, reviewed on a regular cadence." },
    ], closing: { title: "Bring priority to your digital roadmap.", body: "Abexis connects strategic clarity with realistic execution and project leadership.", cta: "Discuss your digital strategy" },
  },
  unternehmensstrategie: {
    meta: { title: "Strategy Process for SMEs: Development and Execution", excerpt: "A clear strategy process for Swiss SMEs: current state, options, decisions, execution and effective review." }, eyebrow: "Corporate strategy", title: "Strategy process for SMEs: decisions, not just a strategy document", lead: "An effective strategy process creates clarity about where a company intends to win, what it will not pursue and which capabilities execution requires.",
    answer: { title: "What are the stages of a strategy process?", body: "A strategy process links situation analysis, future direction, strategic options, binding decisions and execution. The presentation is not the outcome; priorities, ownership, resources and regular progress reviews must fit together." },
    sections: [
      { title: "Expose the starting point and assumptions", body: "Market, customers, competitors, capabilities and financial room are considered together. The aim is not exhaustive analysis but identifying the few factors that genuinely change decisions." },
      { title: "Develop options and make real choices", body: "Good strategy names alternatives and trade-offs. Management and the board decide which customers, offers and capabilities have priority—and what will deliberately not be pursued.", points: ["Strategic guardrails", "Assessed options", "Clear priorities and choices", "Measurable strategic objectives"] },
      { title: "Translate strategy into leadership and execution", body: "Actions, budgets and responsibilities move into operational planning. A compact review cadence shows whether assumptions still hold and the organisation is moving in the agreed direction." },
    ], faq: [
      { q: "Who should take part in the strategy process?", a: "Typically owners, board and executive management in clearly defined roles. Market, customer or subject experts are involved selectively." },
      { q: "How often should strategy be reviewed?", a: "Execution should be reviewed several times a year. A fundamental reassessment is useful when markets, owner objectives or major assumptions change." },
      { q: "What is the most important output?", a: "A shared, decision-ready target state with a few priorities, clear ownership and an executable agenda." },
    ], closing: { title: "Make strategic priorities decision-ready.", body: "Abexis structures the process, challenges assumptions and supports translation into execution.", cta: "Discuss your strategy process" },
  },
  vertriebmarketing: {
    meta: { title: "Developing and Executing a B2B Sales Strategy", excerpt: "B2B sales strategy for Swiss companies: align target customers, value proposition, sales process, steering and execution." }, eyebrow: "Sales and marketing", title: "B2B sales strategy: focus for market, customers and pipeline", lead: "A B2B sales strategy defines which customers to win with which value proposition and through which channels. It connects market choices with the daily work of the sales team.",
    answer: { title: "What makes a B2B sales strategy effective?", body: "It defines attractive segments, relevant customer problems, a differentiated value proposition, clear routes to market and a manageable process. Roles, CRM, metrics and leadership must reinforce these choices or the strategy remains a document." },
    sections: [
      { title: "Sharpen target customers and potential", body: "Not every reachable account is equally attractive. Segmentation, customer value and real win probability focus scarce sales time where need, access and strategic fit align." },
      { title: "Connect the value proposition to the sales process", body: "The process defines how interest is created, needs qualified, solutions developed and decisions supported. Marketing, sales and delivery need shared definitions for handovers and next steps.", points: ["Target segments and buying centres", "Value argument and proof", "Qualification and pipeline stages", "Ownership of handovers and follow-up"] },
      { title: "Steer consistently with a few useful metrics", body: "Pipeline volume alone is not enough. Conversion, time per stage, loss reasons and quality of next steps are more informative. Leaders use the data for decisions, not reporting for its own sake." },
    ], faq: [
      { q: "How is sales strategy different from sales training?", a: "Strategy designs the target market, offer, process and management system. Training builds skills inside that system. Without strategy, teams may train for the wrong accounts or activities." },
      { q: "What role does CRM play?", a: "CRM supports an agreed sales process and creates transparency. It does not replace segmentation or leadership decisions." },
      { q: "When should a sales strategy be revised?", a: "When entering markets, launching offers, facing a weak pipeline, long cycles, low conversion or unclear ownership between marketing and sales." },
    ], closing: { title: "Focus sales work on the right opportunities.", body: "Abexis connects market logic, sales organisation and measurable execution.", cta: "Discuss your sales strategy" },
  },
  "veränderungsmanagement": {
    meta: { title: "Change Management: A Practical Approach", excerpt: "Plan change management systematically: leadership, stakeholders, communication, enablement and adoption in one practical approach." }, eyebrow: "Change management", title: "Change management: lead change and embed it in daily work", lead: "Change management creates the organisational conditions for new strategies, processes or systems to be used in practice. It centres on leadership, participation, enablement and visible decisions.",
    answer: { title: "What belongs in a change-management approach?", body: "An effective approach clarifies the goal and impact, identifies affected groups, strengthens sponsors and leaders, plans communication and enablement, and measures actual adoption. Change management runs alongside delivery—not only shortly before go-live." },
    sections: [
      { title: "Describe impacts concretely", body: "People need to understand what changes in their tasks, decisions and collaboration. A change-impact assessment reveals differences between roles and prevents one generic message for very different situations." },
      { title: "Organise leadership and participation", body: "Sponsors set direction and make visible decisions. Leaders translate change into daily work. Key users and affected employees identify risks and practical barriers early.", points: ["Clear sponsor and leadership model", "Stakeholder and impact analysis", "Dialogue and feedback channels", "Role-based enablement"] },
      { title: "Measure adoption and reinforcement", body: "Training attendance is not adoption. What matters is whether new workflows are used correctly, old paths end and intended results appear. Evidence and feedback direct focused follow-up." },
    ], faq: [
      { q: "When should change management start?", a: "As soon as the target state and major impacts become visible. Early involvement improves planning and credibility; measures become more specific as delivery progresses." },
      { q: "Is communication the same as change management?", a: "No. Communication is one part. Leadership, participation, enablement, role changes and reinforcement in daily work are equally important." },
      { q: "How can success be measured?", a: "Through adoption of new processes or systems, outcome quality, behavioural indicators, feedback and achievement of the business objective." },
    ], closing: { title: "Make change work in daily practice.", body: "Abexis connects change architecture with project leadership and concrete execution.", cta: "Discuss your change initiative" },
  },
  prozessoptimierung: {
    meta: { title: "Analyse and Improve Business Processes", excerpt: "Analyse and improve business processes systematically: objectives, bottlenecks, ownership, automation and measurable improvement." }, eyebrow: "Process optimisation", title: "Analyse and improve processes: impact before activity", lead: "Process optimisation improves lead time, quality, cost or customer experience. It starts with a clear objective and real process evidence—not documenting every workflow in maximum detail.",
    answer: { title: "How should business processes be improved?", body: "First define the objective, process boundaries and relevant metrics. Then analyse the current flow, bottlenecks, errors, waiting time and ownership. Prioritise improvements by impact and effort, test them and anchor them with clear process ownership." },
    sections: [
      { title: "Choose the right process and objective", body: "A process is worth improving when its problem is commercially relevant and influenceable. Complaints, long lead times, quality issues or high manual effort provide concrete starting points." },
      { title: "Make the actual process visible together", body: "Workshops, observation and data show how work really happens. Employees know workarounds, duplication and exceptions. Their experience belongs in the analysis before a target process is designed.", points: ["Process boundaries and customer outcome", "Steps, roles and handovers", "Bottlenecks, loops and errors", "Systems, data and manual work"] },
      { title: "Improve, test and clarify ownership", body: "Not every weakness needs automation. Clear decisions, simpler handovers or fewer variants often help. Pilot changes against a measurable objective; process owners sustain improvement." },
    ], faq: [
      { q: "Must every process be fully documented?", a: "No. The right depth depends on the problem and decision. A focused end-to-end view with reliable evidence is often enough for a bottleneck." },
      { q: "When is automation worthwhile?", a: "When the process is stable and repeatable, volume is sufficient and measurable value exists. Automating an unclear process often embeds the problem." },
      { q: "Who should be involved?", a: "Process owners, people doing the work, affected interfaces and—where relevant—IT, compliance or customer representatives." },
    ], closing: { title: "Improve where value is created.", body: "Abexis creates transparency, prioritises the right levers and supports implementation.", cta: "Discuss process optimisation" },
  },
  projektmanagement: {
    meta: { title: "Project in Trouble: Stabilise and Reorient", excerpt: "What to do when a project is in trouble: identify warning signs, establish an objective view, make decisions and stabilise delivery." }, eyebrow: "Project management", title: "Project in trouble: clarity before action", lead: "A critical project first needs a defensible view of reality. More meetings, new lists or extra pressure achieve little when objectives, decisions, ownership or risks remain unclear.",
    answer: { title: "How can a troubled project be stabilised?", body: "Stabilisation starts with an independent assessment of objective, scope, progress, risks, governance and team dynamics. A small number of immediate actions, required management decisions and a realistic plan then follow. Transparency matters more than an artificially reassuring status report." },
    sections: [
      { title: "Take warning signs seriously", body: "Repeatedly delayed decisions, shifting priorities, falling trust, unclear ownership or a status that does not match observed outputs signal a need for intervention. Early clarification preserves options." },
      { title: "Separate the situation from its causes", body: "A review examines documents, results and the perspectives of key participants. Symptoms such as delay are separated from causes such as unclear scope, weak decisions or unrealistic resourcing.", points: ["Objective, value and success criteria", "Scope and actual progress", "Risks, dependencies and decisions", "Governance, roles and collaboration"] },
      { title: "Steer stabilisation with accountability", body: "Actions need owners, dates and decision points. Depending on the situation, scope is reduced, governance adjusted, leadership reinforced or a turnaround plan established. Progress is measured by outcomes." },
    ], faq: [
      { q: "When is a project considered critical?", a: "Not only after schedule or budget overrun. A project is also critical when value, decision capacity or trust are visibly at risk." },
      { q: "Does an independent project audit help?", a: "Yes, when internal reporting no longer creates a shared view or participants are strongly tied to existing positions. The audit should lead to decisions and action." },
      { q: "Must the project lead be replaced?", a: "Not automatically. Clarify causes and roles first. Additional capacity, clearer governance or concrete management decisions may be more useful than replacing a person." },
    ], closing: { title: "Create a defensible view of reality.", body: "The Abexis Project Reality Check identifies priority risks, decision needs and concrete next steps.", cta: "Discuss a Project Reality Check" },
  },
  risikomanagement: {
    meta: { title: "Identify and Manage Project Risks Early", excerpt: "Identify, prioritise and manage project risks early: risk analysis, ownership, indicators and independent risk support." }, eyebrow: "Risk management", title: "Identify project risks early: from register to decision", lead: "Risk management cannot prevent every surprise. It ensures relevant uncertainty becomes visible early, owners act and governance bodies can decide in time.",
    answer: { title: "How are project risks managed effectively?", body: "Describe each risk as a possible event with a cause and impact, prioritise it by probability and severity, and assign an owner. Indicators, actions and decision dates turn a risk register into a management instrument." },
    sections: [
      { title: "Describe risks concretely", body: "Labels such as ‘resources’ or ‘interface’ are not yet risk statements. Cause, possible event and impact show what an action must address and who can decide." },
      { title: "Set priorities and indicators", body: "Assessment considers probability and damage as well as proximity, detectability and dependencies. Measurable indicators show when observation is no longer enough and escalation is required.", points: ["Unambiguous risk statement", "Assessment and priority", "Owner and response", "Indicators and escalation path"] },
      { title: "Secure an independent view", body: "Delivery pressure can normalise familiar risks. An external risk manager challenges changes, tests whether responses work and reports appropriately to the project lead or steering body." },
    ], faq: [
      { q: "How often should project risks be reviewed?", a: "As often as the project and its decision cycles change. Critical risks belong in every relevant steering meeting; the full picture should be reassessed regularly." },
      { q: "What is the difference between an issue and a risk?", a: "A risk may occur in the future; an issue has already occurred. Both need ownership, but different responses and communication." },
      { q: "When is an external risk manager useful?", a: "When impact is high, dependencies are complex, internal capacity is limited or governance needs an independent view of risks and responses." },
    ], closing: { title: "Turn risks into manageable decisions.", body: "Abexis provides a focused assessment or ongoing independent risk support.", cta: "Discuss risk support" },
  },
  "executive-search": {
    meta: { title: "Finding Executives through Executive Search in Switzerland", excerpt: "How Executive Search works in Switzerland: role profile, market outreach, assessment, confidentiality and successful placement." }, eyebrow: "Executive Search Switzerland", title: "Finding executives: discreet, structured and precise", lead: "Executive Search reaches candidates who are not actively looking. A successful appointment begins with clarity about the mandate, impact, environment and requirements beyond the CV.",
    answer: { title: "When does Executive Search make sense?", body: "Executive Search is suited to leadership and key positions where the active applicant market is too small, confidentiality matters or industry and leadership experience must match precisely. It combines market mapping, discreet direct outreach and structured assessment." },
    sections: [
      { title: "Clarify the role and success before searching", body: "A job description is not enough. The mandate, expected outcomes, authority, leadership context, culture and challenges of the first twelve months matter." },
      { title: "Map the relevant market systematically", body: "Target industries, companies, functions and experience shape the search strategy. Direct outreach reaches qualified people whether or not they use job platforms. Confidentiality and respectful communication define the process.", points: ["Mandate and competency profile", "Target market and research", "Discreet direct outreach", "Structured interviews and references"] },
      { title: "Assess fit with evidence", body: "Technical experience is only one part. Motivation, leadership behaviour, learning ability and fit with the specific organisation are assessed against comparable criteria, creating a transparent decision basis." },
    ], faq: [
      { q: "How does Executive Search differ from recruitment agencies?", a: "Executive Search is mandate-led, actively researches the relevant market and directly approaches suitable people. It is designed for demanding, confidential or hard-to-reach profiles." },
      { q: "How long does a search take?", a: "Timing depends on the role, market and decision process. A clear mandate, fast feedback and committed interview dates shorten the process substantially." },
      { q: "Can confidential searches be handled?", a: "Yes. Confidentiality, information scope and outreach are agreed before the search and protected throughout the process." },
    ], closing: { title: "Clarify your next key appointment.", body: "Abexis SEARCH combines rigorous market outreach with first-hand leadership and industry experience.", cta: "Discuss a search mandate" },
  },
};

const slugs: Record<ServiceGuideParent, string> = Object.fromEntries(de.map((page) => [page.parent, page.slug])) as Record<ServiceGuideParent, string>;
const en: ServiceGuidePage[] = de.map((page) => ({ parent: page.parent, slug: page.slug, locale: "en", ...translations[page.parent] }));

export const focusGuidePages = de.filter((page) => page.parent !== "executive-search");
export const executiveSearchGuide = de.find((page) => page.parent === "executive-search")!;

export function getServiceGuide(parent: string, slug: string, locale: ServiceGuideLocale): ServiceGuidePage | undefined {
  return (locale === "en" ? en : de).find((page) => page.parent === parent && page.slug === slug);
}

export function getGuideForParent(parent: string, locale: ServiceGuideLocale): ServiceGuidePage | undefined {
  const slug = slugs[parent as ServiceGuideParent];
  return slug ? getServiceGuide(parent, slug, locale) : undefined;
}

export function getAllServiceGuides(locale: ServiceGuideLocale) {
  return locale === "en" ? en : de;
}
