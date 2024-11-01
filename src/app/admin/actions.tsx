"use server";

import { auth } from "@/auth";
import { hints } from "@/db/schema";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/*
IMPORTANT TODO: Make sure to handle synchronization issues between
multiple people trying to claim the same hint at the same time
#BadFirstIssue
*/

export async function respondToHint(hintId: number, response: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }

  await db
    .update(hints)
    .set({
      response,
      responseTime: new Date(),
      status: "answered",
    })
    .where(eq(hints.id, hintId));

  revalidatePath("/admin");
}

export async function claimHint(hintId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not logged in.");
  }

  if (session.user.role !== "admin") {
    throw new Error("Not authorized.");
  }

  const hint = await db.query.hints.findFirst({
    where: eq(hints.id, hintId),
  });

  if (!hint) {
    throw new Error("Hint not found.");
  }

  if (hint.claimer && hint.claimer !== session.user.id) {
    revalidatePath("/admin");
    throw new Error("Hint claimed by " + hint.claimer + ".");
  }

  await db
    .update(hints)
    .set({
      claimer: session.user.id,
      claimTime: new Date(),
    })
    .where(eq(hints.id, hintId));

  revalidatePath("/admin");
}

export async function unclaimHint(hintId: number) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }

  await db
    .update(hints)
    .set({ claimer: null, claimTime: null })
    .where(eq(hints.id, hintId));

  revalidatePath("/admin");
}
