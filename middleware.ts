import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  // Ignora api, _next, _vercel y cualquier archivo estático con extensión
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
