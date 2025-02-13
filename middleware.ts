import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const publicRoutes = ["/", "/remove-bg", "/face-swap", "/enhance-quality"];
const apiAuthPrefix = "/api";
const DEFAULT_LOGIN_REDIRECT = "/";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Allow API routes
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // Handle auth routes
  if (authRoutes.includes(nextUrl.pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!isLoggedIn && !publicRoutes.includes(nextUrl.pathname)) {
    // let callbackUrl = nextUrl.pathname;
    // if (nextUrl.search) callbackUrl += nextUrl.search;

    return NextResponse.redirect(
      new URL(`/?callbackUrl=notAuthenticated`, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
