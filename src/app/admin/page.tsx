import { auth } from "@/auth";

export default async function Home() {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return <p>You are not authorized to access this page.</p>
    }

    return <p>This is the admin page.</p>
}