import "~/styles/globals.css";
import { Providers } from "~/app/nav/providers";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { CommandPalette } from "./CommandPalette";

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
      <Providers>
        <CommandPalette />
        <body>{children}</body>
      </Providers>
    </html>
  );
}
