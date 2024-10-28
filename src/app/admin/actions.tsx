"use server";

import { auth } from "@/auth";
import { hints } from "@/db/schema";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";

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
    })
    .where(eq(hints.id, hintId));
}
