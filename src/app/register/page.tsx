"use server";
import { RegisterForm } from "./RegisterForm";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <RegisterForm />
    </div>
  );
}
