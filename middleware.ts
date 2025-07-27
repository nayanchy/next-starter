import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  publicRoute,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "./lib/constants/routes";
import { NextResponse } from "next/server";
import next from "next";

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoute.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const signInUrl = new URL("/auth/login", nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);

    return NextResponse.redirect(signInUrl);
  }

  if (isPublicRoute) {
    const verifyRoute = nextUrl.pathname === "/auth/verify";
    if (verifyRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }

      if (!isLoggedIn) {
        const isTokenInUrl = nextUrl.searchParams.has("token");

        if (!isTokenInUrl) {
          return NextResponse.redirect(new URL("/auth/login", nextUrl));
        }
      }
    }
  }

  return null;
});

export const config = {
  //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
