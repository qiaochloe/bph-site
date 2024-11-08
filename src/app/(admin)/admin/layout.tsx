import "~/styles/globals.css";
import { AdminTopNav, AdminTopNavSpacer } from "~/app/nav/AdminTopNav";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AdminTopNav />
      <AdminTopNavSpacer />
      <main className="mx-5 mb-5 flex min-h-[calc(100vh-80px-5rem)]">
        {children}
      </main>
      <Toaster />
    </>
  );
}
