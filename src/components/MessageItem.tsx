// components/MessageItem.tsx

import { Message } from "@botpress/client";
import React from "react";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUserMessage = message.direction === "incoming";

  return (
    <div
      className={`flex mb-2 ${isUserMessage ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isUserMessage
            ? "bg-gray-200 text-black"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {message.payload.text}
      </div>
    </div>
  );
};

export default MessageItem;
