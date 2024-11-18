"use server";

import DefaultTeamPage from "~/app/(hunt)/teams/team-page/DefaultTeamPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <DefaultTeamPage username={slug} />;
}
