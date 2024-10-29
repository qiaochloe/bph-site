"use client";
import { logout } from "./actions";

export function LogoutButton() {
  return <button onClick={() => logout()}>Logout</button>;
}