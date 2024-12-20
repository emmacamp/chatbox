"use client";
import React, { useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import { Client } from "@botpress/client";
import { isDefinedAndHasItems } from "@/lib/utils";
import { CredentialsClientBP } from "@/types/botpress";
import { toast } from "sonner";
import { Button } from "./ui";
import { groupBy } from "lodash";
import DaySeparator from "./DaySeparator"; // Asegúrate de tener este componente
import { ArrowDown, ArrowUp } from "lucide-react";
import { ChatLoadingSkeleton } from "./skeletons";
import { useMessages } from "@/store/MessagesContext";

interface MessageListProps {
  conversationId: string;
  credentials: CredentialsClientBP;
  className?: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  conversationId,
  credentials,
  className,
  messagesEndRef,
}) => {
  const { messages, setMessages } = useMessages();
  const [nextMessagesToken, setNextMessagesToken] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const client = new Client({
          token: credentials.token,
          workspaceId: credentials.workspaceId,
          botId: credentials.botId,
        });
        const response = await client.listMessages({
          conversationId,
        });

        setNextMessagesToken(response.meta.nextToken || undefined);

        if (!response.messages) {
          return toast.error("No se encontraron mensajes");
        }

        setMessages(response.messages);
        scrollToBottom();
      } catch (error: any) {
        console.error("Error fetching messages:", error);

        if (error?.code == 429) {
          return toast.error(
            "Limite de peticiones a la API alcanzado, intente de nuevo mas tarde."
          );
        }
      }
    };

    fetchMessages();
  }, [setMessages, credentials, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Ordenar y agrupar mensajes por día
  const sortedAndGroupedMessages = React.useMemo(() => {
    const sortedMessages = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return groupBy(sortedMessages, (message) => {
      const date = new Date(message.createdAt);
      return date.toDateString(); // Agrupa por fecha legible
    });
  }, [messages]);

  async function loadOlderMessages() {
    const client = new Client({
      token: credentials.token,
      workspaceId: credentials.workspaceId,
      botId: credentials.botId,
    });

    try {
      if (!nextMessagesToken || !credentials) {
        return toast.error("No hay mensajes anteriores");
      }

      const getMessages = await client.listMessages({
        conversationId,
        nextToken: nextMessagesToken,
      });

      setMessages((prevMessages) => [...getMessages.messages, ...prevMessages]);

      setNextMessagesToken(getMessages.meta.nextToken || undefined);
    } catch (error) {
      console.error(JSON.stringify(error));

      toast.error("No se pudo cargar los mensajes anteriores");
    }
  }

  return (
    <div className={`${className} flex flex-col `}>
      {isDefinedAndHasItems(messages) ? (
        <>
          {!nextMessagesToken ? (
            <div className="rounded-md p-2 m-3 bg-primary text-primary-foreground w-fit self-center font-medium text-center italic">
              Start of the conversation
            </div>
          ) : (
            <Button
              onClick={loadOlderMessages}
              variant={"outline"}
              className="mb-3 w-fit self-center"
            >
              <ArrowDown className="mr-2 h-4 w-4 animate-bounce" />
              Load more messages
              <ArrowUp className="ml-2 h-4 w-4 animate-bounce" />
            </Button>
          )}

          {Object.entries(sortedAndGroupedMessages).map(
            ([date, dayMessages]) => (
              <React.Fragment key={date}>
                <DaySeparator date={date} />
                {dayMessages.map((message) => (
                  <MessageItem message={message} key={message.id} />
                ))}
              </React.Fragment>
            )
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ChatLoadingSkeleton />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
