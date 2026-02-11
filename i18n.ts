import { getRequestConfig } from "next-intl/server";
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

// 공유 config 등에서 가져올 수 있음
const locales = ["en", "ko", "ja"];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as any)) {
    locale = "ko";
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

export const routing = defineRouting({
  // 지원하는 언어 목록
  locales: ["ko", "en", "ja"],

  // 기본 언어 (URL에 언어가 없을 때)
  defaultLocale: "ko",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
