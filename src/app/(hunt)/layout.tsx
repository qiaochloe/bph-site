import "~/styles/globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { HuntTopNavSpacer } from "../nav/HuntTopNavSpacer";
import { auth } from "~/server/auth/auth";
import { LogoutButton } from "../nav/LogoutButton";
import { HamburgerMenu, MenuItem } from "../nav/HamburgerMenu";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  const leftMenuItems: MenuItem[] = [
    {
      title: "Home",
      href: "/",
      type: "link",
    },
    {
      title: "Puzzles",
      href: "/puzzle",
      type: "link",
    },
    {
      title: "Teams",
      href: "/teams",
      type: "link",
    },
  ];

  const rightMenuItems: MenuItem[] = [];

  if (session?.user?.role == "admin") {
    rightMenuItems.push({
      title: "admin",
      href: "/admin",
      type: "link",
    });
  }

  if (session?.user?.id) {
    leftMenuItems.push({
      title: "Feedback",
      href: "/feedback",
      type: "link",
    });

    rightMenuItems.push({
      title: session.user.displayName,
      href: `/${session.user.username}`,
      type: "link",
    });

    rightMenuItems.push({
      title: "logout",
      element: <LogoutButton />,
      type: "element",
    });
  } else {
    rightMenuItems.push({
      title: "Login",
      href: "/login",
      type: "link",
    });
  }

  return (
    <>
      <HamburgerMenu
        leftMenuItems={leftMenuItems}
        rightMenuItems={rightMenuItems}
      />
      <HuntTopNavSpacer />
      <main className="flex min-h-[calc(100vh-80px-2em)]">{children}</main>
      <Toaster />
      <footer className="py-2 text-center text-xs">
        <p>
          Having a good time? Want support more puzzlehunts like this in the
          future? Consider{" "}
          <Link
            href="https://bbis.advancement.brown.edu/BBPhenix/give-now?did=05732af4-d994-4d40-bcd6-fb42d07b6eab"
            className="text-blue-500 hover:underline"
          >
            donating
          </Link>{" "}
          to your friendly neighborhood{" "}
          <Link
            href="http://brownpuzzle.club/"
            className="text-blue-500 hover:underline"
          >
            puzzle club
          </Link>
          .
        </p>
      </footer>
    </>
  );
}
