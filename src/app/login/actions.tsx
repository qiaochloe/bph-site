"use server";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  try {
    await signIn("credentials", { username, password, redirect: false });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Username or password is incorrect" };
    } else {
      return { error: "An unexpected error occurred" };
    }
  }
}

export async function logout() {
  await signOut();
}
