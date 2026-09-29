import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { ReactNode } from "react";
import "../styles/globals.css";
import { Header } from "@/components/layout/header";
import { CustomCursor } from "@/components/ui/custom-cursor";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "3cuartos", template: "%s | 3cuartos" },
  description: "Branding, desarrollo web y marketing digital conectados.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body><Header /><CustomCursor />{children}</body>
    </html>
  );
}
