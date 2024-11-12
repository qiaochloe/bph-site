"use server";

import { auth } from "~/server/auth/auth";
import { db } from "@/db/index";
import { teams } from "@/db/schema";
import { eq } from "drizzle-orm";
import Toast from "~/app/(hunt)/teams/team-page/Toast";
import { TeamInfoPage } from "~/app/(hunt)/teams/team-page/TeamInfoPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Authentication
  const session = await auth();
  if (!session?.user?.id) {
    return <p>Not authenticated.</p>;
  }

  const { slug } = await params;
  const username = String(slug);

  // Check if slug is a valid username
  const team = await db.query.teams.findFirst({
    where: eq(teams.username, username),
  });

  if (!team) {
    return (
      <Toast
        title={"Team not found"}
        description={`No team with username ${slug} was found.`}
      />
    );
  }

  return (
    <TeamInfoPage
      displayName={team.displayName}
      username={username}
      teamId={team.id}
    />
  );
}