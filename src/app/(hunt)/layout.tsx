import "~/styles/globals.css";
import { HuntTopNav, HuntTopNavSpacer } from "../nav/HuntTopNav";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <HuntTopNav />
      <HuntTopNavSpacer />
      <main className="mx-5 mb-5 flex min-h-[calc(100vh-80px-5rem)]">
        {children}
      </main>
      <Toaster />
    </>
  );
}
