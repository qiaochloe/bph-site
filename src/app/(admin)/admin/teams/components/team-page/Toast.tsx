"use client";

import { useRouter } from "next/navigation";
import { toast } from "~/hooks/use-toast";

export default function Toast({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const router = useRouter();

  toast({
    title: title,
    description: description,
  });

  router.push("/admin/teams");
  return null;
}
