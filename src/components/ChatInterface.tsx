"use server";
import { Suspense } from "react";

import { Message } from "@botpress/client";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { CredentialsClientBP } from "@/types/botpress";
import { ChatLoadingSkeleton } from "./skeletons";

interface ChatInterfaceProps {
  conversationId: string;
  credentials: CredentialsClientBP;
}

export interface ChatParticipant {
  bot: Message;
  user: Message;
}

const ChatInterface: React.FC<ChatInterfaceProps> = async ({
  conversationId,
  credentials,
}) => {
  return (
    <div className="flex flex-col h-[85vh]">
      {/* Sección de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 h-[100%]">
        <MessageList
          conversationId={conversationId}
          credentials={credentials}
        />
      </div>

      {/* Sección de entrada de mensaje */}
      <div className="p-4 border-t">
        <MessageInput
          credentials={credentials}
          conversationId={conversationId}
          className="flex items-center space-x-4 w-full"
        />
      </div>
    </div>
  );
};

export default ChatInterface;
