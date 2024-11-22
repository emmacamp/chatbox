"use client";
import React, { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { Client, Message } from "@botpress/client";
import { isDefinedAndHasItems } from "@/lib/utils";
import { CredentialsClientBP } from "@/types/botpress";
import { toast } from "sonner";
import { Button } from "./ui";
import { groupBy } from "lodash";
import DaySeparator from "./DaySeparator";

interface MessageListProps {
  conversationId: string;
  credentials: CredentialsClientBP;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  conversationId,
  credentials,
  className,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextMessagesToken, setNextMessagesToken] = useState<
    string | undefined
  >(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          nextToken: nextMessagesToken,
        });

        setNextMessagesToken(response.meta.nextToken || undefined);

        if (!response.messages) {
          return toast.error("No messages found");
        }

        setMessages(response.messages);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Ordenar y agrupar mensajes por día
  const sortedAndGroupedMessages = React.useMemo(() => {
    const sortedMessages = messages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return groupBy(sortedMessages, (message) => {
      const date = new Date(message.createdAt);
      return date.toISOString().split("T")[0]; // Agrupa por fecha
    });
  }, [messages]);

  return (
    <div className={className}>
      {isDefinedAndHasItems(messages) ? (
        <>
          {!nextMessagesToken ? (
            <div className="rounded-md p-2 m-3 text-slate-600 font-medium text-center italic">
              Start of the conversation
            </div>
          ) : (
            <Button variant={"outline"} className="w-full">
              Load more messages
            </Button>
          )}

          {Object.entries(sortedAndGroupedMessages).map(
            ([date, dayMessages]) => (
              <React.Fragment key={date}>
                <DaySeparator date={new Date(date)} />
                {dayMessages.map((message, index) => (
                  <MessageItem message={message} key={`${date}-${index}`} />
                ))}
              </React.Fragment>
            )
          )}
        </>
      ) : (
        <div className="rounded-md p-2 m-3 border-2 font-medium text-center">
          Start of the conversation
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
