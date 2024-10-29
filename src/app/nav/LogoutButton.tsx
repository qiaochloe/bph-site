"use client";
import { logout } from "./actions";

export function LogoutButton() {
  return <button className="hover:underline" onClick={() => logout()}>Logout</button>;
}
