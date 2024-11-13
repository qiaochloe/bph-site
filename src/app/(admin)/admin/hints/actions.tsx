"use server";

import { auth } from "@/auth";
import { hints } from "@/db/schema";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { teams } from "@/db/schema";

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

  revalidatePath("/admin/");
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
    revalidatePath("/admin/");
    const user = await db.query.teams.findFirst({
      where: eq(teams.id, hint.claimer),
    });
    return { claimer: user?.displayName };
  }

  await db
    .update(hints)
    .set({
      claimer: session.user.id,
      claimTime: new Date(),
    })
    .where(eq(hints.id, hintId));

  revalidatePath("/admin/");
  return { claimer: null };
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

  revalidatePath("/admin/");
}

export async function refundHint(hintId: number) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }

  await db
    .update(hints)
    .set({ status: "refunded" })
    .where(eq(hints.id, hintId));

  revalidatePath("/admin/");
}
