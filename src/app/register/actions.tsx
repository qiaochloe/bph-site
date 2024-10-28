"use server";

import { db } from "@/db/index";
import { teams, type interactionModeEnum } from "@/db/schema";
import { hash } from "bcrypt";

export async function insertTeam(
  username: string,
  displayName: string,
  password: string,
  interactionMode: (typeof interactionModeEnum.enumValues)[number],
) {
  // TODO: check if team username already exists before inserting
  // Remember to handle the error in the register form
  // #GoodFirstIssue

  hash(password, 10, async (err, hash) => {
    if (err) throw err;

    await db.insert(teams).values({
      username,
      displayName,
      password: hash,
      role: "user" as const,
      interactionMode,
      createTime: new Date(),
    });
  });
}
