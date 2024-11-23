"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CredentialsClientBP, UserBP } from "@/types/botpress";
import { Client } from "@botpress/client";
import { listConversationsWithMessages } from "@/services";
import { toast } from "sonner";
import Link from "next/link";

// Importamos los componentes Select e Input
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import wsp from "@/components/whatsapp.svg";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { LogoutButton } from "./logout-btn";
import { BotNameSidebar } from "./bot-name-sidebar";

// Conversation Interface
export interface ConversationBP {
  id: string;
  createdAt: string;
  updatedAt: string;
  channel: string;
  integration: string;
  tags: {
    [key: string]: string;
  };
}

export function AppSidebar({
  credentials,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  credentials: CredentialsClientBP;
}) {
  const [conversations, setConversations] = useState<ConversationBP[]>([]);
  const [conversationData, setConversationData] = useState<
    {
      conversationId: string;
      integration: string;
      userName?: string;
      userPhone?: string;
    }[]
  >([]);
  const [botInfo, setBotInfo] = useState<{ name: string; id: string } | null>(
    null
  );

  // Estados para el filtro y la búsqueda
  const [selectedIntegration, setSelectedIntegration] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (credentials) {
      const currentBotId = credentials.botId;
      const getBotInfo = async () => {
        try {
          const client = new Client({
            token: credentials.token,
            workspaceId: credentials.workspaceId,
            botId: credentials.botId,
          });
          const response = await client.getBot({ id: currentBotId });
          setBotInfo(response.bot);
        } catch (error) {
          toast.error("Error getting bot info");
          console.error("Error al obtener la información del bot:", error);
        }
      };
      getBotInfo();
    }
  }, [credentials]);

  useEffect(() => {
    // Inicializar el cliente de Botpress
    const client = new Client({
      token: credentials.token,
      workspaceId: credentials.workspaceId,
      botId: credentials.botId,
    });

    // Obtener las conversaciones
    listConversationsWithMessages(client, undefined, true)
      .then((response) => {
        setConversations(response.conversations);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [credentials]);

  useEffect(() => {
    // Función para obtener datos del usuario para cada conversación
    const fetchConversationData = async () => {
      const client = new Client({
        token: credentials.token,
        workspaceId: credentials.workspaceId,
        botId: credentials.botId,
      });

      const data = await Promise.all(
        conversations.map(async (conversation) => {
          let userName: string | undefined;
          let userPhone: string | undefined;

          if (conversation.integration === "whatsapp") {
            try {
              // Obtener mensajes de la conversación
              const messagesResponse = await client.listMessages({
                conversationId: conversation.id,
              });
              const messages = messagesResponse.messages;

              // Encontrar el primer mensaje entrante para obtener el userId
              const incomingMessage = messages.find(
                (message) => message.direction === "incoming"
              );

              if (incomingMessage && incomingMessage.userId) {
                const userId = incomingMessage.userId;

                try {
                  // Obtener datos del usuario
                  const userResponse = await client.getUser({ id: userId });
                  const user = userResponse.user as UserBP;

                  userName = user.name;
                  userPhone =
                    user.tags["whatsapp:userId"] ||
                    user.tags["whatsapp:userPhone"];
                } catch (error) {
                  console.error("Error fetching user:", error);
                }
              }
            } catch (error) {
              console.error("Error fetching messages:", error);
            }
          }

          return {
            conversationId: conversation.id,
            integration: conversation.integration,
            userName,
            userPhone,
          };
        })
      );

      setConversationData(data);
    };

    if (conversations.length > 0) {
      fetchConversationData();
    }
  }, [conversations, credentials]);

  // Filtrar las conversaciones según la integración y la consulta de búsqueda
  const filteredConversations = conversationData.filter((conversation) => {
    // Filtrar por integración
    if (
      selectedIntegration !== "all" &&
      conversation.integration !== selectedIntegration
    ) {
      return false;
    }

    // Filtrar por nombre o número si la integración es whatsapp
    if (selectedIntegration === "whatsapp" && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const userName = conversation.userName?.toLowerCase() || "";
      const userPhone = conversation.userPhone?.toLowerCase() || "";
      return userName.includes(query) || userPhone.includes(query);
    }

    // Si no hay filtro de búsqueda o la integración no es whatsapp, mostrar todas
    return true;
  });

  // Agrupar las conversaciones filtradas por integración
  const conversationsByIntegration = filteredConversations.reduce<{
    [key: string]: {
      conversationId: string;
      userName?: string;
      userPhone?: string;
    }[];
  }>((acc, conversation) => {
    const { integration } = conversation;
    if (!acc[integration]) {
      acc[integration] = [];
    }
    acc[integration].push({
      conversationId: conversation.conversationId,
      userName: conversation.userName,
      userPhone: conversation.userPhone,
    });
    return acc;
  }, {});

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-2">
        <BotNameSidebar botName={botInfo?.name} />
        {/* Componente de búsqueda y filtro */}
        <SidebarGroup className="py-0 flex flex-row border rounded-lg justify-between items-center">
          <SidebarGroupContent className="relative w-full focus-within:ring-1 focus-within:ring-inset focus-within:ring-gray-300">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 pl-8 border-0 bg-transparent focus:ring-0 ring-offset-0 focus:ring-offset-0 focus:outline-none"
            />

            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          </SidebarGroupContent>
          <SidebarGroupContent className="relative w-[80px]">
            <Select
              value={selectedIntegration}
              onValueChange={(value) => setSelectedIntegration(value)}
            >
              <SelectTrigger className="w-[80px]  border-0 bg-transparent focus:ring-0 ring-offset-0 ">
                <SelectValue placeholder="Select integration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🌎</SelectItem>
                <SelectItem value="whatsapp">
                  <Image
                    alt="whatsapp"
                    height={20}
                    width={20}
                    src={wsp}
                    className="mr-2 h-4 w-4"
                  />
                </SelectItem>
                {/* Puedes añadir más integraciones aquí */}
              </SelectContent>
            </Select>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* Renderizar las conversaciones agrupadas por integración */}
        {Object.entries(conversationsByIntegration).map(
          ([integration, convs]) => (
            <Collapsible
              key={integration}
              title={integration}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {integration.toUpperCase()}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {convs.map((conversation) => (
                        <SidebarMenuItem key={conversation.conversationId}>
                          <SidebarMenuButton asChild className="p-2">
                            <Link
                              className={`${
                                integration === "whatsapp" &&
                                conversation.userPhone
                                  ? "!py-0 !h-11"
                                  : ""
                              } `}
                              href={`/management/chat/${
                                conversation.conversationId
                              }?integration=${integration}${
                                conversation.userName
                                  ? `&userName=${conversation.userName}`
                                  : ""
                              }`}
                            >
                              {/* Mostrar nombre y número para WhatsApp */}
                              <div className="">
                                {integration === "whatsapp" && (
                                  <div className="flex flex-col">
                                    <div className="font-bold">
                                      {conversation.userName || "Unknown"}
                                    </div>
                                    <div>{conversation.userPhone}</div>
                                  </div>
                                )}

                                {/* Mostrar ID de conversación para otras integraciones */}
                                {integration !== "whatsapp" && (
                                  <div className="font-bold">
                                    {conversation.conversationId.slice(0, 13)}
                                  </div>
                                )}
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        )}
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
