// /Users/isang-yeob/Crowdians/crowdians/middleware/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/../i18n";

export default createMiddleware(routing);

export const config = {
  // Match all paths except for api, _next/static, _next/image, and favicon
  matcher: [
    // 1. 루트 경로 (localhost:3000) -> 여기서 리다이렉트 발생!
    "/",

    // 2. 이미 언어 경로가 붙은 경우 (localhost:3000/kr/...)
    "/(kr|en|jp)/:path*",

    // 3. 그 외: API, Next 내부파일, 확장자(.png 등)가 있는 파일을 "제외"한 모든 경로
    //    (혹시 모를 경로 누락 방지용)
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
