import "~/styles/globals.css";
import { TopNav, TopNavSpacer } from "~/app/nav/TopNav";
import { Toaster } from "@/components/ui/toaster";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Providers } from "~/app/providers";

export const metadata: Metadata = {
  title: "Brown Puzzle Hunt",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Providers>
          <TopNav />
          <TopNavSpacer />
          <main className="flex min-h-[calc(100vh-80px-5rem)] mx-5 mb-5">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
