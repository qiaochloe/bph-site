import "~/styles/globals.css";
import { Providers } from "~/app/nav/providers";
import { HuntTopNav, HuntTopNavSpacer } from "../nav/HuntTopNav";
import { Toaster } from "@/components/ui/toaster";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

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
          <HuntTopNav />
          <HuntTopNavSpacer />
          <main className="mx-5 mb-5 flex min-h-[calc(100vh-80px-5rem)]">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
