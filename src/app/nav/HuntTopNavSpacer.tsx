"use client";
import { usePathname } from "next/navigation";

export function HuntTopNavSpacer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return <div className={`min-h-[80px] ${isHomePage && "bg-pine"}`}></div>;
}
