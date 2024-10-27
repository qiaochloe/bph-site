"use server";

import { db } from "@/db/index";
import { teams, interactionModeEnum } from "@/db/schema";

export async function insertTeam(username: string, displayName: string, password: string, interactionMode: (typeof interactionModeEnum.enumValues)[number]) {
  // TODO: check if team username already exists before inserting
  // Remember to handle the error in the register form
  // #GoodFirstIssue

  // TODO: Hash and salt the password before inserting
  // #BadFirstIssue
  await db.insert(teams).values({
    username,
    displayName,
    password,
    role: "user" as const,
    interactionMode,
    createTime: new Date(),
  })
}