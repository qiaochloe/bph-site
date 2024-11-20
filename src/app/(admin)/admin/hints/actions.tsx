"use server";

import { auth } from "@/auth";
import { hints } from "@/db/schema";
import { db } from "@/db/index";
import { eq, and, isNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function respondToHint(hintId: number, response: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }

  // For a response to go through, the hint claimer must be the user and
  // the hint status must be no_response
  let user = session.user.id ? session.user.id : "";
  let result = await db
    .update(hints)
    .set({
      response,
      responseTime: new Date(),
      status: "answered",
    })
    .where(
      and(
        eq(hints.id, hintId),
        eq(hints.claimer, user),
        eq(hints.status, "no_response"),
      ),
    )
    .returning({ id: hints.id });

  revalidatePath("/admin/");

  // Error-handling
  if (result.length != 1) {
    let hint = await db.query.hints.findFirst({ where: eq(hints.id, hintId) });
    if (!hint) {
      return {
        title: "Error responding to hint",
        error: "Hint entry not found",
        response: response,
      };
    } else if (hint.claimer !== user) {
      return {
        title: "Error responding to hint",
        error: `Hint not claimed by user. Its current value is ${hint.claimer}.`,
        response: response,
      };
    } else if (hint.status != "no_response") {
      return {
        title: "Error responding to hint",
        error: `Hint status is not no_response. It is ${hint.status}.`,
        response: response,
      };
    } else {
      return {
        title: "Error responding to hint",
        error: "Unexpected error occured",
        response: response,
      };
    }
  }

  return { error: null };
}

export async function claimHint(hintId: number) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }

  // For a hint to be claimed, the claimer must be null
  // And the hint status must be "no_response"
  let result = await db
    .update(hints)
    .set({
      claimer: session.user.id,
      claimTime: new Date(),
    })
    .where(
      and(
        eq(hints.id, hintId),
        isNull(hints.claimer),
        eq(hints.status, "no_response"),
      ),
    )
    .returning({ id: hints.id });

  revalidatePath("/admin/");

  // Error-handling
  if (result.length != 1) {
    let hint = await db.query.hints.findFirst({ where: eq(hints.id, hintId) });
    if (!hint) {
      return {
        title: "Error claiming hint",
        error: "Hint entry not found",
      };
    } else if (hint.claimer !== null) {
      return {
        title: "Error claiming hint",
        error: "Hint already claimed",
      };
    } else if (hint.status !== "no_response") {
      return {
        title: "error claiming hint",
        error: `Hint status is not no_response. It is ${hint.status}.`,
      };
    } else {
      return {
        title: "Error claiming hint",
        error: "Unexpected error occured",
      };
    }
  }

  return { error: null };
}

export async function unclaimHint(hintId: number) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }

  // For a hint to be unclaimed, the claimer must be the user
  // And the hint status must be "no_response"
  let user = session.user.id ? session.user.id : "";
  let result = await db
    .update(hints)
    .set({ claimer: null, claimTime: null })
    .where(
      and(
        eq(hints.id, hintId),
        eq(hints.claimer, user),
        eq(hints.status, "no_response"),
      ),
    )
    .returning({ id: hints.id });
  revalidatePath("/admin/");

  if (result.length != 1) {
    let hint = await db.query.hints.findFirst({ where: eq(hints.id, hintId) });
    if (!hint) {
      return {
        title: "Error unclaiming hint",
        error: "Hint entry not found",
      };
    } else if (hint.claimer !== user) {
      return {
        title: "Error unclaiming hint",
        error: "Hint not currently claimed by user",
      };
    } else if (hint.status !== "no_response") {
      return {
        title: "Error unclaiming hint",
        error: `Hint status is not no_response. It is ${hint.status}.`,
      };
    } else {
      return {
        title: "Error unclaiming hint",
        error: "Unexpected error occured",
      };
    }
  }

  return { error: null };
}

export async function refundHint(hintId: number) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }

  // For a hint to be refunded, the claimer must be the user
  // And the hint status must not be "no_response"
  let user = session.user.id ? session.user.id : "";
  let result = await db
    .update(hints)
    .set({ status: "refunded" })
    .where(
      and(
        eq(hints.id, hintId),
        eq(hints.claimer, user),
        ne(hints.status, "no_response"),
      ),
    )
    .returning({ id: hints.id });

  revalidatePath("/admin/");

  if (result.length != 1) {
    let hint = await db.query.hints.findFirst({ where: eq(hints.id, hintId) });
    if (!hint) {
      return {
        title: "Error refunding hint",
        error: "Hint entry not found",
      };
    } else if (hint.claimer !== user) {
      return {
        title: "Error refunding hint",
        error: "Hint not currently claimed by user",
      };
    } else if (hint.status === "no_response") {
      return {
        title: "Error refunding hint",
        error: "Hint status is no_response",
      };
    } else {
      return {
        title: "Error refunding hint",
        error: "Unexpected error occured",
      };
    }
  }

  return { error: null };
}
