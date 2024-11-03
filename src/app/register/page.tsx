"use server";
import { REGISTRATION_START_TIME, REGISTRATION_END_TIME } from "@/hunt.config";
import { RegisterForm } from "./RegisterForm";

export default async function Home() {
  if (new Date() < REGISTRATION_START_TIME) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p>Registration has not started yet.</p>
      </div>
    );
  }

  if (new Date() > REGISTRATION_END_TIME) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p>Registration has ended.</p>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col items-center">
      <h1>Register!</h1>
      <RegisterForm />
    </div>
  );
}
