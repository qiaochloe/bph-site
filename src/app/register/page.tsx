"use server";
import { RegisterForm } from "./RegisterForm";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col items-center">
      <h1 className="p-4">Register!</h1>
      <RegisterForm />
    </div>
  );
}
