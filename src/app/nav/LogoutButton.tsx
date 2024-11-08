"use client";
import { useRouter } from "next/dist/client/components/navigation";
import { logout } from "./actions";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <button className="hover:underline" onClick={handleLogout}>
      Logout
    </button>
  );
}
