"use server";
import { REGISTRATION_START_TIME, REGISTRATION_END_TIME } from "@/hunt.config";
import { RegisterForm } from "./RegisterForm";
import { auth } from "~/server/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  // Redirect register page to home page if the user is logged in
  let session = await auth();
  if (session?.user?.role && session?.user?.role !== "admin") {
    redirect("/");
  }

  if (new Date() < REGISTRATION_START_TIME) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <p>Registration has not started yet.</p>
      </div>
    );
  }

  if (new Date() > REGISTRATION_END_TIME) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <p>Registration has ended.</p>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col items-center">
      <h1 className="mb-2">Register!</h1>
      <RegisterForm />
    </div>
  );
}
