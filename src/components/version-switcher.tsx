"use client";

import * as React from "react";
import { Bot, Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AUTH_ROUTES } from "@/routes";
import Link from "next/link";

export function VersionSwitcher({
  versions,
  defaultVersion,
  botName,
}: {
  versions?: string[];
  defaultVersion?: string;
  botName: string | undefined;
}) {
  // const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* <DropdownMenu> */}
        {/* <DropdownMenuTrigger asChild> */}
        <SidebarMenuButton
          size="lg"
          asChild
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href={AUTH_ROUTES.MANAGEMENT.ROOT} className="flex gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Bot className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">
                {botName?.toUpperCase() || "Bot"}
              </span>
              <span className="">Bot</span>
            </div>
          </Link>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </SidebarMenuButton>
        {/* </DropdownMenuTrigger> */}
        {/* <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent> */}
        {/* </DropdownMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
