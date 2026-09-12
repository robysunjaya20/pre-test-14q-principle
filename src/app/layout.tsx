import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "14Q Basics Principle | Quality Training",
  description:
    "Pre Test 14Q Basics Principle - PT. Bumjin Electronics Indonesia",
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