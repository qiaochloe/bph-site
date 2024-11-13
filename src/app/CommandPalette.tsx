"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Trophy,
  Puzzle,
  MailQuestion,
  House,
  PartyPopper,
  UserSearch,
  MessageCircleWarning,
} from "lucide-react";

export function CommandPalette() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation()
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (session?.data?.user?.role != "admin") {
    return <></>
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Hunt">
          <CommandItem
            onSelect={() => {
              router.push("/");
              setOpen(false);
            }}
          >
            <PartyPopper className="text-red-500" />
            <span>Hunt</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/puzzle");
              setOpen(false);
            }}
          >
            <Puzzle className="text-red-500" />
            <span>Puzzles</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/teams");
              setOpen(false);
            }}
          >
            <Trophy className="text-red-500" />
            <span>Leaderboard</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Admin">
          <CommandItem
            onSelect={() => {
              router.push("/admin");
              setOpen(false);
            }}
          >
            <House className="text-blue-500" />
            <span>Admin</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/admin/puzzles");
              setOpen(false);
            }}
          >
            <Puzzle className="text-blue-500" />
            <span>Solutions</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/admin/teams");
              setOpen(false);
            }}
          >
            <UserSearch className="text-blue-500" />
            <span>Teams</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/admin/hints");
              setOpen(false);
            }}
          >
            <MailQuestion className="text-blue-500" />
            <span>Hinting</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/admin/errata");
              setOpen(false);
            }}
          >
            <MessageCircleWarning className="text-blue-500" />
            <span>Errata</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
