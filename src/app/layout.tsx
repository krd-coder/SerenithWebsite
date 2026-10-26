import type { Metadata } from "next";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";

const faviconVersion = createHash("sha256")
  .update(readFileSync(join(process.cwd(), "public", "favicon.svg")))
  .digest("hex")
  .slice(0, 12);

export const metadata: Metadata = {
  title: "Serenith — Discover the connection. Protect the discovery.",
  description:
    "A private coordination layer for research. Explore encrypted semantic matching, proof of existence, and confidential collaboration with Serenith.",
  icons: {
    icon: {
      url: `/favicon.svg?v=${faviconVersion}`,
      type: "image/svg+xml",
      sizes: "any",
    },
  },
  openGraph: {
    title: "Serenith — Breakthroughs without exposure.",
    description:
      "Your next breakthrough is out there. Your research stays with you.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
