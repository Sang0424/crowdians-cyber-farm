"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { type ThemeProviderProps } from "next-themes"; // Correct type import based on version

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <Theme accentColor="iris" radius="medium">
        {children}
      </Theme>
    </NextThemesProvider>
  );
}
