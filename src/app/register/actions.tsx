"use server";

import { db } from "@/db/index";
import { teams } from "@/db/schema";
import { hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { login } from "../login/actions";

export async function insertTeam(prevState: any, formData: FormData) {
  // Values are validated client side via zod, can check explicitly if deemed necessary
  const username = formData.get("username")?.toString()!;
  const displayName = formData.get("displayName")?.toString()!;
  const password = formData.get("password")?.toString()!;
  const interactionMode = formData.get("interactionMode")?.toString()!;
  if (interactionMode !== "in-person" && interactionMode !== "remote") {
    return { error: "Invalid interaction mode" };
  }
  const duplicateUsername = await db.query.teams.findFirst({
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

    return login(prevState, formData);
  } catch (error) {
    return { error: "Unexpected error occurred" };
  }
}
