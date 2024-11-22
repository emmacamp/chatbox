// components/MessageItem.tsx

import { Message } from "@botpress/client";
import React from "react";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUserMessage = message.direction === "incoming";

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      // weekday: "long",
    });
  };

  return (
    <div
      className={`flex mb-2 ${isUserMessage ? "justify-start" : "justify-end"}`}
    >
      <div className="relative max-w-md">
        {/* Cola del mensaje */}
        <div
          className={`absolute top-0 ${
            isUserMessage
              ? "-left-2 border-secondary"
              : "-right-2 border-primary"
          }`}
          style={{
            width: "10px",
            height: "16px",
            clipPath: isUserMessage
              ? "polygon(100% 0, 0 0, 100% 100%)"
              : "polygon(0 0, 100% 0, 0 100%)",
            backgroundColor: isUserMessage
              ? "hsl(var(--secondary))"
              : "hsl(var(--primary))",
          }}
        />

        {/* Contenido del mensaje */}
        <div
          className={`relative flex flex-col p-3 ${
            isUserMessage
              ? "bg-secondary text-secondary-foreground rounded-tr-lg rounded-br-lg rounded-bl-lg"
              : "bg-primary text-primary-foreground rounded-tl-lg rounded-bl-lg rounded-br-lg"
          }`}
        >
          <span className="relative z-10">{message.payload.text}</span>
          <span className="text-sm opacity-70 mt-1 self-end">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
