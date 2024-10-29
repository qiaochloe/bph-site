"use server";

import { db } from "@/db/index";
import { teams, type interactionModeEnum } from "@/db/schema";
import { hash } from "bcrypt";
import { eq } from "drizzle-orm";

export async function insertTeam(
  username: string,
  displayName: string,
  password: string,
  confirmPassword: string,
  interactionMode: (typeof interactionModeEnum.enumValues)[number],
) {

  console.log(password)
  console.log(confirmPassword)
  const duplicateUsername = await db.query.teams.findFirst({
    where: eq(teams.username, username),
  });

  if (duplicateUsername) {
    return { error: "Username already taken" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  hash(password, 10, async (err, hash) => {
    if (err) return { error: "Unexpected error occurred" };

    await db.insert(teams).values({
      username,
      displayName,
      password: hash,
      role: "user" as const,
      interactionMode,
      createTime: new Date(),
    });
  });

  return { error: null };
}
