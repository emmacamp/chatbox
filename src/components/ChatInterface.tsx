"use client";

import React, { useState, useEffect, useRef } from "react";

import { Client, Message } from "@botpress/client";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { CredentialsClientBP } from "@/types/botpress";
import { toast } from "sonner";

interface ChatInterfaceProps {
  conversationId: string;
  credentials: CredentialsClientBP;
}

export interface ChatParticipant {
  bot: Message;
  user: Message;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationId,
  credentials,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextMessagesToken, setNextMessagesToken] = useState<
    string | undefined
  >(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages
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

        // const userParticipant = response.messages.find(
        //   (message) => message.direction === "incoming"
        // );
        // const botParticipant = response.messages.find(
        //   (message) => message.direction === "outgoing"
        // );

        // if (!userParticipant || !botParticipant) {
        //   return toast.error("No messages found");
        // }

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

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message Section */}
      <div className="flex-1 overflow-auto p-4">
        <MessageList
          messages={messages}
          hasMoreMessages={nextMessagesToken ? true : false}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <MessageInput
        credentials={credentials}
        conversationId={conversationId}
        addMessage={addMessage}
      />
    </div>
  );
};

export default ChatInterface;
