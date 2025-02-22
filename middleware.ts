import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];
const publicRoutes = [
  "/",
  "/remove-bg",
  "/face-swap",
  "/enhance-quality",
  "not-found",
];
const privateRoutes = ["/gallery"];
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
  if (!isLoggedIn && privateRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(
      new URL(`/?authStatus=notAuthenticated`, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
