import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Serenith — Discover the connection. Protect the discovery.",
  description:
    "A private coordination layer for research. Explore encrypted semantic matching, proof of existence, and confidential collaboration with Serenith.",
  icons: { icon: "/favicon.svg" },
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
