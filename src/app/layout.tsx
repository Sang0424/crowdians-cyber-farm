// /Users/isang-yeob/Crowdians/crowdians/src/app/layout.tsx
import { getMessages, getLocale } from "next-intl/server";
import { ReactNode } from "react";
import localFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const myCustomFont = localFont({
  src: "../../public/font/DungGeunMo.woff2",
  display: "swap",
});

const myCustomFont2 = localFont({
  src: "../../public/font/Galmuri14.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crowdians | AI 파트너와 함께하는 픽셀 몬스터 모험",
  description:
    "Crowdians에서 나만의 AI 챗봇 파트너와 함께 매력적인 픽셀 몬스터 세계로 모험을 떠나보세요.",
  keywords: [
    "픽셀",
    "챗봇",
    "AI",
    "ai",
    "몬스터",
    "파트너",
    "모험",
    "Crowdians",
    "크라우디언즈",
    "pixel",
    "chatbot",
    "monster",
    "partner",
    "adventure",
  ],
  openGraph: {
    title: "Crowdians | AI 파트너와 함께하는 픽셀 몬스터 모험",
    description:
      "Crowdians에서 나만의 AI 챗봇 파트너와 함께 매력적인 픽셀 몬스터 세계로 모험을 떠나보세요.",
    type: "website",
    siteName: "Crowdians",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "Crowdians | AI 파트너와 함께하는 픽셀 몬스터 모험",
    description:
      "Crowdians에서 나만의 AI 챗봇 파트너와 함께 매력적인 픽셀 몬스터 세계로 모험을 떠나보세요.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${myCustomFont.className} ${myCustomFont2.className}`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
