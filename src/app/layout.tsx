import type { Metadata } from "next";
import { Cormorant_Garamond, Heebo } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const heebo = Heebo({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "תאילנד 2026",
  description: "מתכנן המסלול לתאילנד",
};

export const viewport = {
  themeColor: "#faf6f0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${cormorant.variable} ${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
