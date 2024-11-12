"use server";
import { teams, type interactionModeEnum, type roleEnum } from "@/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { auth } from "~/server/auth/auth";

export type TeamProperties = {
  username?: string;
  displayName?: string;
  password?: string;
  interactionMode?: (typeof interactionModeEnum.enumValues)[number];
  role?: (typeof roleEnum.enumValues)[number];
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

  const session = await auth();
  if (session?.user?.id !== id && session?.user?.role !== "admin") {
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
  if (teamProperties.role) {
    if (session?.user?.role === "admin") user.role = teamProperties.role;
  }
  await db.update(teams).set(user).where(eq(teams.id, id));
  try {
    return { error: null };
  } catch (error) {
    return { error: "Unexpected error occurred" };
  }
}
