import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AUTH_ROUTES } from "@/routes";
import { getSession } from "@/services/storage";
import { Client } from "@botpress/client";
import { CredentialsClientBP } from "@/types/botpress";

export const metadata: Metadata = {
  title: "Management | ChatBox",
  description: "Aplicación para gestion de turnos en Compras y Contrataciones",
};

export default async function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const credentials = (await getSession())?.credentials as CredentialsClientBP;

  // console.log(client);

  return (
    <SidebarProvider>
      <AppSidebar credentials={credentials} />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={AUTH_ROUTES.MANAGEMENT.ROOT}>
                  Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
