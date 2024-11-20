import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { db } from "@/db/index";
import { and, eq } from "drizzle-orm";
import { unlocks } from "./server/db/schema";
import { HUNT_START_TIME, INITIAL_PUZZLES } from "@/hunt.config";

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
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

  // Protect puzzle pages.
  // This only matches on /puzzle/puzzleId, not /puzzle/puzzleId/solution
  // or /puzzle/puzzleId/hint
  if (req.nextUrl.pathname.match(/^\/puzzle\/[^\/]+\/$/)) {
    // Unauthenticated users
    if (!req.auth?.user?.id) {
      const newUrl = new URL("/login", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }

    // Before the hunt starts
    if (new Date() < HUNT_START_TIME) {
      const newUrl = new URL("/puzzle", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }

    // Puzzle not unlocked by team
    const puzzleId = req.nextUrl.pathname.split("/").at(2);
    if (!puzzleId) {
      throw Error("Unexpected error");
    }
    const initialPuzzles = await INITIAL_PUZZLES();
    if (
      initialPuzzles &&
      !initialPuzzles.includes(puzzleId) &&
      !(await db.query.unlocks.findFirst({
        where: and(
          eq(unlocks.teamId, req.auth.user.id),
          eq(unlocks.puzzleId, puzzleId),
        ),
      }))
    ) {
      const newUrl = new URL("/puzzle", req.nextUrl.origin);
      return Response.redirect(newUrl);
    }
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
