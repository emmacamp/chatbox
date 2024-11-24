"use client";
import React, { useEffect, useRef, useState } from "react";
import { Message } from "@botpress/client";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { CredentialsClientBP } from "@/types/botpress";
import { ChevronDown } from "lucide-react";
import { MessagesProvider } from "@/store/MessagesContext";

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
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollToBottom(false);
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;

    // Mostrar el botón si el usuario ha hecho scroll hacia arriba más de 100px
    if (scrollHeight - scrollTop - clientHeight > 100) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  };

  return (
    <MessagesProvider>
      <div className="flex flex-col h-[85vh] relative">
        {/* Sección de mensajes */}
        <div
          className="flex-1 overflow-y-auto p-4 h-[100%]"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          <MessageList
            conversationId={conversationId}
            credentials={credentials}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* Botón para volver al final */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 left-4 p-2 bg-primary text-white rounded-full shadow-md"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        )}

        {/* Sección de entrada de mensaje */}
        <div className="p-4 border-t">
          <MessageInput
            credentials={credentials}
            conversationId={conversationId}
            className="flex items-center space-x-4 w-full justify-center"
          />
        </div>
      </div>
    </MessagesProvider>
  );
};

export default ChatInterface;
