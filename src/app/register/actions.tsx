"use server";

import { db } from "@/db/index";
import { teams, interactionModeEnum } from "@/db/schema";

export async function insertTeam(username: string, displayName: string, password: string, interactionMode: (typeof interactionModeEnum.enumValues)[number]) {
  // TODO: check if team already exists
  // Also hash and salt the password
  await db.insert(teams).values({
    username,
    displayName,
    password,
    role: "user" as const,
    interactionMode,
    createTime: new Date(),
  })
}