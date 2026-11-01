import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TitikPKL — Temukan PKL Terdekat",
  description:
    "Temukan jajanan langgananmu atau mulai berdagang hari ini. Platform yang menghubungkan pedagang kaki lima dengan konsumen secara real-time.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]">
        {children}
      </body>
    </html>
  );
}
