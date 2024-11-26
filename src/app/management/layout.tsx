import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/services/storage";
import { CredentialsClientBP } from "@/types/botpress";
import { DynamicUrl } from "@/components/dynamic-url";
import { getBotInfo } from "@/services/api.services";

export const metadata: Metadata = {
  title: "Management | ChatBox",
  description: "Aplicación para gestion de conversaciones de AI Agents.",
};

export default async function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const credentials = (await getSession())?.credentials as CredentialsClientBP;
  const botName = (await getBotInfo(credentials.botId))?.name;

  return (
    <SidebarProvider>
      <AppSidebar credentials={credentials} botName={botName} />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicUrl />
        </header>
        <main
          className="container mx-auto flex-grow p-5 md:p-10 md:overflow-y-auto"
          suppressHydrationWarning
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
