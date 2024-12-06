import "~/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "~/server/auth/auth";
import { LogoutButton } from "~/app/nav/LogoutButton";
import { HamburgerMenu, MenuItem } from "~/app/nav/HamburgerMenu";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  const leftMenuItems: MenuItem[] = [
    {
      title: "Home",
      href: "/admin",
      type: "link",
    },
    {
      title: "Solutions",
      href: "/admin/solutions",
      type: "link",
    },
    {
      title: "Teams",
      href: "/admin/teams",
      type: "link",
    },
    {
      title: "Hinting",
      href: "/admin/hints",
      type: "link",
    },
    {
      title: "Errata",
      href: "/admin/errata",
      type: "link",
    },
  ];

  const rightMenuItems: MenuItem[] = [
    {
      title: session!.user!.displayName,
      href: `/${session!.user!.username}`,
      type: "link",
    },
    {
      title: "Hunt",
      href: "/",
      type: "link",
    },
    {
      title: "logout",
      element: <LogoutButton />,
      type: "element",
    },
  ];

  return (
    <div className="h-full min-h-screen pb-5">
      <div className="bg-slate-100">
        {/* Navbar */}
        <HamburgerMenu
          leftMenuItems={leftMenuItems}
          rightMenuItems={rightMenuItems}
        />
      </div>
      {/* Navbar spacer */}
      <div className="min-h-[80px]"></div>
      <main className="mx-5 mb-5 flex min-h-[calc(100vh-80px-5rem)]">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
