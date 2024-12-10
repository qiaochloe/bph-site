import { auth } from "~/server/auth/auth";
import { db } from "@/db/index";
import { teams } from "@/db/schema";
import { eq } from "drizzle-orm";
import Toast from "./Toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamInfoForm } from "./TeamInfoForm";
import { PasswordResetForm } from "./PasswordResetForm";

export default async function DefaultTeamPage({
  username,
}: {
  username: string;
}) {
  // Authentication
  const session = await auth();
  if (!session?.user?.id) {
    return <p>Not authenticated.</p>;
  }

  // Check if slug is a valid username
  const team = await db.query.teams.findFirst({
    where: eq(teams.username, username),
  });

  if (
    !team ||
    (team.id != session.user.id && !(session.user.role === "admin"))
  ) {
    return (
      <Toast
        title={"Team not found"}
        description={`No team with username ${username} was found.`}
      />
    );
  }

  return (
    <div className="mb-6 flex w-2/3 min-w-36 grow flex-col">
      <div className="flex flex-col items-center pb-6">
        <h1 className="">Welcome, {team.displayName}!</h1>
        <p>
          {username} • {team.interactionMode}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <Tabs
          defaultValue="teamInfo"
          className="w-2/3 overflow-auto rounded-md bg-zinc-100 p-4"
        >
          <TabsList>
            <TabsTrigger value="teamInfo">Team Info</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="password">Reset Password</TabsTrigger>
          </TabsList>
          <TabsContent value="teamInfo">
            <div className="bg-zinc-100 p-4 text-zinc-700">
              <TeamInfoForm teamId={team.id} />
            </div>
          </TabsContent>
          <TabsContent value="members">
            <div className="p-4">
              <p className="text-sm font-medium text-zinc-700">
                Under construction.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="p-4">
              <PasswordResetForm teamId={team.id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
