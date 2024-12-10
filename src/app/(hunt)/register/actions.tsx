"use server";

import { db } from "@/db/index";
import { teams, type interactionModeEnum } from "@/db/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { login } from "../login/actions";
import axios from "axios";

/** Inserts a team into the team table */
export async function insertTeam(
  username: string,
  displayName: string,
  password: string,
  interactionMode: (typeof interactionModeEnum.enumValues)[number],
) {
  username = username.toLowerCase();

  const duplicateUsername = await db.query.teams.findFirst({
    columns: { id: true },
    where: eq(teams.username, username),
  });

  if (duplicateUsername) {
    return { error: "Username already taken" };
  }

  try {
    const hashedPassword = await new Promise<string>((resolve, reject) => {
      hash(password, 10, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    await db.insert(teams).values({
      username,
      displayName,
      password: hashedPassword,
      role: "user" as const,
      interactionMode,
      createTime: new Date(),
    });

    if (process.env.DISCORD_WEBHOOK_URL) {
      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        content: `:busts_in_silhouette: **New Team**: ${displayName} ([${username}](https://puzzlethon.brownpuzzle.club/teams/${username}))`,
      });
    }

    return login(username, password);
  } catch (error) {
    return { error: "Unexpected error occurred" };
  }
}
