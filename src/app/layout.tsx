import type { Metadata, Viewport } from "next";
import { Gaegu, Gowun_Batang, Jua } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { AppShell } from "@/components/ui/AppShell";
import "./globals.css";

const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua", preload: false });
const gowun = Gowun_Batang({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-gowun", preload: false });
const gaegu = Gaegu({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-gaegu", preload: false });

export const metadata: Metadata = {
  title: "인생관리공단",
  description: "당신의 인생, 저희가 대신 이해해 드립니다.",
};

export const viewport: Viewport = { themeColor: "#F6F0E5" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${jua.variable} ${gowun.variable} ${gaegu.variable}`}>
      <body>
        <MotionProvider>
          <AppShell>{children}</AppShell>
        </MotionProvider>
      </body>
    </html>
  );
}
