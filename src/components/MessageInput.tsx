"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client, CreateMessageRequestBody, Message } from "@botpress/client";
import { CredentialsClientBP } from "@/types/botpress";
import { toast } from "sonner";
interface MessageInputProps {
  conversationId: string;
  addMessage: (message: Message) => void;
  credentials: CredentialsClientBP;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  addMessage,
  credentials,
}) => {
  const [inputValue, setInputValue] = useState("");

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

    console.log({ newMessage });

    try {
      const client = new Client({
        token: credentials.token,
        workspaceId: credentials.workspaceId,
        botId: credentials.botId,
      });

      // Send message to the API
      const response = await client.createMessage(newMessage);
      const sentMessage = response.message;
      addMessage(sentMessage);

      console.log({ response });

      // Optionally, get bot response
      //   const botResponse = await getBotResponse(conversationId, sentMessage);
      //   if (botResponse) {
      //     addMessage(botResponse);
      //   }

      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getBotResponse = async (
    conversationId: string,
    userMessage: Message
  ): Promise<Message | null> => {
    try {
      const client = new Client({
        token: credentials.token,
        workspaceId: credentials.workspaceId,
        botId: credentials.botId,
      });

      // Logic to get bot response
      // This might be via a webhook or another API call
      // For simplicity, we'll simulate a bot response

      const response = await client.createMessage({
        payload: { text: "This is a bot response." },
        userId: "bot_123", // Replace with actual bot ID
        conversationId,
        type: "text",
        tags: {},
      });

      return response.message;
    } catch (error) {
      toast.error("Error getting bot response");
      console.error("Error getting bot response:", error);
      return null;
    }
  };

  return (
    <div className="p-4 border-t flex items-center space-x-4">
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
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
};

export default MessageInput;
