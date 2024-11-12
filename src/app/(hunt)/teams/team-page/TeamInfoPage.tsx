"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamInfoForm } from "../team-page/TeamInfoForm";
import { PasswordResetForm } from "../team-page/PasswordResetForm";
type TeamInfoPageProps = {
  displayName: string;
  username: string;
  teamId: string;
};

export function TeamInfoPage({
  displayName,
  username,
  teamId,
}: TeamInfoPageProps) {
  return (
    <div className="flex w-2/3 min-w-36 grow flex-col">
      <div className="flex flex-col items-center py-8">
        <h1>Team Name: {displayName}</h1>
        <h2>Team username: {username}</h2>
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
              <TeamInfoForm teamId={teamId} />
            </div>
          </TabsContent>
          <TabsContent value="members">
            <div className="p-4">
              <p>Under Construction.</p>
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="p-4">
              <PasswordResetForm teamId={teamId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
