import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getAuthCookieName } from "./helper/GlobalValueHelper";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request) {
  const url = request.nextUrl.clone();
  const response = handleI18nRouting(request);

  // ignore the login page to prevent an infinite redirect loop
  if (url.pathname.startsWith("/login")) {
    return response;
  }

  // ignore health-check page
  if (url.pathname.endsWith("/health-check")) {
    return response;
  }

  const cookies = request.cookies;

  const auth = cookies.has(getAuthCookieName());

  if (!auth) {
    url.searchParams.set("redirect", url.pathname);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
