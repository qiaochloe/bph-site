"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export type MenuItem = {
  title: string;
  href?: string;
  element?: JSX.Element;
  type: "link" | "element";
};

type Props = {
  leftMenuItems: MenuItem[];
  rightMenuItems: MenuItem[];
};

export function HamburgerMenu({ leftMenuItems, rightMenuItems }: Props) {
  return (
    <nav className="flex items-center justify-between p-4">
      {/* Left menu items */}
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            {leftMenuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.type == "element" ? (
                  item.element!
                ) : (
                  <Link href={item.href!} legacyBehavior passHref>
                    <NavigationMenuLink className="bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md p-2">
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Right menu items */}
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            {rightMenuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.type == "element" ? (
                  item.element!
                ) : (
                  <Link href={item.href!} legacyBehavior passHref>
                    <NavigationMenuLink className="bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-10 w-max items-center justify-center rounded-md p-2">
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Hamburger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex items-center justify-center md:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="w-full">
          <nav className="flex flex-col items-center space-y-4 pt-6">
            {[...leftMenuItems, ...rightMenuItems].map((item) => (
              <React.Fragment key={item.title}>
                <SheetTrigger asChild>
                  {item.type == "element" ? (
                    item.element!
                  ) : (
                    <Link href={item.href!}>{item.title}</Link>
                  )}
                </SheetTrigger>
              </React.Fragment>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
