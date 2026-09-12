import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "14 Q Principle",
  description: "Pre Test 14 Q Principle",

  openGraph: {
    title: "14 Q Principle",
    description: "Pre Test 14 Q Principle",
    url: "https://pre-test-14q-principle.vercel.app/",
    siteName: "14 Q Principle",
    images: [
      {
        url: "/og_bei.png",
        width: 800,
        height: 450,
        alt: "PT Bumjin Electronics Indonesia - Quality Training",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "14 Q Principle",
    description: "Pre Test 14 Q Principle",
    images: ["/og_bei.png"],
  },

  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}