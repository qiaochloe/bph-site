"use server";

import { auth } from "@/auth";
import { feedback } from "@/db/schema";
import { db } from "@/db/index";

export async function insertFeedback(description: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await db.insert(feedback).values({
    teamId: session.user.id,
    description,
  });

  return { error: null };
}
