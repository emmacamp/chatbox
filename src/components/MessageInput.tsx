"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client, CreateMessageRequestBody, Message } from "@botpress/client";
import { CredentialsClientBP } from "@/types/botpress";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { revalidatePathClient, revalidateTagChat } from "@/lib/utils.server";
interface MessageInputProps {
  conversationId: string;
  // addMessage: (message: Message) => void;
  // scrollToBottom: () => void;
  credentials: CredentialsClientBP;
  className?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  // addMessage,
  // scrollToBottom,
  credentials,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Create the message payload
    const newMessage: CreateMessageRequestBody = {
      payload: { text: inputValue },
      userId: credentials.botId,
      conversationId,
      type: "text",
      tags: {},
    };

    try {
      const client = new Client({
        token: credentials.token,
        workspaceId: credentials.workspaceId,
        botId: credentials.botId,
      });

      // Send message to the API
      // const response =
      await client.createMessage(newMessage);
      // const sentMessage = response.message;
      // addMessage(sentMessage);

      // revalidateTagChat();
      // revalidatePathClient("/management/chat");
      setInputValue("");
      // scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={`${className}`}>
      <Input
        type="text"
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        className="flex-1"
      />
      <Button onClick={handleSendMessage} disabled={inputValue.trim() === ""}>
        <Send />
      </Button>
    </div>
  );
};

export default MessageInput;
