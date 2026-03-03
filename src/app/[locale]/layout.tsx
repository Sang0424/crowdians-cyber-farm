// /Users/isang-yeob/Crowdians/crowdians/src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import { ModalProvider } from "@/../context/LoginModalContext";
import { WaitListModalProvider } from "@/../context/WaitListModalContext";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/../context/theme-provider";
import { NicknameSetup } from "@/../components/domain/NicknameSetUp";
import "@radix-ui/themes/styles.css";

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const locale = await getLocale();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NicknameSetup />
        <ModalProvider>
          <WaitListModalProvider>{children}</WaitListModalProvider>
        </ModalProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
