"use server";

import { auth } from "@/auth";
import { feedback } from "@/db/schema";
import { db } from "@/db/index";

export async function insertFeedback(description: string) {
  const session = await auth();

  await db.insert(feedback).values({
    description,
  });

  return { error: null };
}
