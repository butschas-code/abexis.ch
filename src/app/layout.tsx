import type { Metadata, Viewport } from "next";
import "./globals.css";
import { logoUrl } from "@/data/site-images";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#26337c",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.abexis.ch"),
  title: {
    default: "Abexis : Managementberatung",
    template: "%s | Abexis",
  },
  description:
    "Als gefragte Managementberatung helfen wir Ihrem Unternehmen strategisch voranzukommen, Wachstumspotenziale zu nutzen und wirksame Strukturen und Prozesse zu etablieren.",
  openGraph: {
    siteName: "Abexis",
    locale: "de_CH",
    type: "website",
    images: [
      {
        url: logoUrl,
        width: 1592,
        height: 759,
        alt: "Abexis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abexis : Managementberatung",
    description: "Business Transformation, Strategie & Führungsberatung.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
