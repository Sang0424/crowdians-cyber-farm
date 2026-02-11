// /Users/isang-yeob/Crowdians/crowdians/src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import { Flex } from "@radix-ui/themes";
import SideNav from "@/../components/layout/side-nav";
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
        <Flex>
          <ModalProvider>
            <WaitListModalProvider>
              <SideNav />
              <main
                style={{
                  flexGrow: 1,
                  fontFamily: "DungGeunMo",
                }}
              >
                {children}
              </main>
            </WaitListModalProvider>
          </ModalProvider>
        </Flex>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

