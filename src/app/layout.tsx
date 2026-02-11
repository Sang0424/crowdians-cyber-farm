// /Users/isang-yeob/Crowdians/crowdians/src/app/layout.tsx
import { getMessages, getLocale } from "next-intl/server";
import { ReactNode } from "react";
import localFont from "next/font/local";
import { Metadata } from "next";
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
  title: "Crowdians",
  description: "Crowdians",
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
      </body>
    </html>
  );
}
