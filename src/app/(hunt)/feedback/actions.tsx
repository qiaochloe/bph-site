"use server";

import { auth } from "@/auth";
import { feedback, teams } from "@/db/schema";
import { db } from "@/db/index";
import { eq } from "drizzle-orm";

import axios from "axios";

export async function insertFeedback(description: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await db.insert(feedback).values({
    teamId: session.user.id,
    description,
  });

  const user = await db.query.teams.findFirst({
    where: eq(teams.id, session.user.id),
  });

  await axios.post(process.env.DISCORD_WEBHOOK_URL!, {
    content: `📝 **Feedback** by [${user?.username}](https://puzzlethon.brownpuzzle.club/teams/${user?.username}): _${description}_`,
  });

  return { error: null };
}
