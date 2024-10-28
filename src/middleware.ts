import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import { HUNT_START_TIME } from "@/hunt.config";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Allow admins to access all pages
  if (req.auth?.user?.role === "admin") {
    return;
  }

  // Protect admin pages from non-admin users
  if (
    req.auth?.user?.role !== "admin" &&
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    const newUrl = new URL("./", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // Protect puzzle pages from unauthenticated users
  if (!req.auth && req.nextUrl.pathname.match("/puzzle/.+")) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // Protect puzzle pages before the hunt starts
  if (
    new Date() < HUNT_START_TIME &&
    req.nextUrl.pathname.match("/puzzle/.+")
  ) {
    const newUrl = new URL("/puzzle", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // Redirect register page to home page if the user is logged in
  if (req.auth && req.nextUrl.pathname === "/register") {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
