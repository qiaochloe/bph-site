"use server";
import { teams, type interactionModeEnum } from "@/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { hash } from "bcrypt";

export type TeamProperties = {
  username?: string;
  displayName?: string;
  password?: string;
  interactionMode?: (typeof interactionModeEnum.enumValues)[number];
};

export async function updateTeam(
  id: string | undefined,
  teamProperties: TeamProperties,
) {
  if (!id) {
    return {
      error: "Unexpected error occurred",
    };
  }

  const user = await db.query.teams.findFirst({
    where: eq(teams.id, id),
  });

  if (!user) {
    return {
      error: "No team matching the given ID was found",
    };
  }

  if (teamProperties.username) user.username = teamProperties.username;
  if (teamProperties.displayName) user.displayName = teamProperties.displayName;
  if (teamProperties.password) {
    const hashedPassword = await new Promise<string>((resolve, reject) => {
      hash(teamProperties.password!, 10, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
    user.password = hashedPassword;
  }
  if (teamProperties.interactionMode)
    user.interactionMode = teamProperties.interactionMode;
  await db.update(teams).set(user).where(eq(teams.id, id));
  try {
    return { error: null };
  } catch (error) {
    return { error: "Unexpected error occurred" };
  }
}
