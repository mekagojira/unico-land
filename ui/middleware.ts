import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware({
  ...routing,
  localeDetection: false // Disable browser language detection
});

export const config = {
  matcher: ["/", "/(jp|vi)/:path*"],
};
