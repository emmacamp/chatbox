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
import wsp from "@/components/whatsapp.svg";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { LogoutButton } from "./logout-btn";
import { BotNameSidebar } from "./bot-name-sidebar";

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
    const client = new Client({
      token: credentials.token,
      workspaceId: credentials.workspaceId,
      botId: credentials.botId,
    });

    listConversationsWithMessages(client, undefined, true)
      .then((response) => {
        setConversations(response.conversations);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [credentials]);

  useEffect(() => {
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
              const messagesResponse = await client.listMessages({
                conversationId: conversation.id,
              });
              const messages = messagesResponse.messages;

              const incomingMessage = messages.find(
                (message) => message.direction === "incoming"
              );

              if (incomingMessage && incomingMessage.userId) {
                const userId = incomingMessage.userId;

                try {
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

  const filteredConversations = conversationData.filter((conversation) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const conversationId = conversation.conversationId.toLowerCase();
    const userName = conversation.userName?.toLowerCase() || "";
    const userPhone = conversation.userPhone?.toLowerCase() || "";

    return (
      conversationId.includes(query) ||
      userName.includes(query) ||
      userPhone.includes(query)
    );
  });

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
        <SidebarGroup className="">
          <SidebarGroupContent className="relative w-full">
            <Label htmlFor="search" className="sr-only">
              Search by name, phone, or conv_id
            </Label>
            <SidebarInput
              type="text"
              placeholder="Name, phone or conv_id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 pointer-events-none opacity-50" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className="gap-0">
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
                            {/* <Link
                              className={${
                                integration === "whatsapp" &&
                                conversation.userPhone
                                  ? "!py-0 !h-11"
                                  : ""
                              } }
                              href={/management/chat/${
                                conversation.conversationId
                              }?integration=${integration}${
                                conversation.userName
                                  ? &userName=${conversation.userName}
                                  : ""
                              }}
                            > */}
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
                              <div>
                                {conversation.userName && (
                                  <div className="font-bold">
                                    {conversation.userName}
                                  </div>
                                )}
                                {conversation.userPhone && (
                                  <div>{conversation.userPhone}</div>
                                )}
                                {!conversation.userName &&
                                  !conversation.userPhone && (
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
