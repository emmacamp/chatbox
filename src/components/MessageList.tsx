"use client";
import React, { useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import { Message } from "@botpress/client";
import { isDefinedAndHasItems } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  hasMoreMessages: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  hasMoreMessages,
}) => {
  const [messageList, setMessageList] = useState<Message[]>([]);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4">
      {isDefinedAndHasItems(messages) ? (
        <>
          {!hasMoreMessages && (
            <div className="rounded-md p-2 m-3 border-2 font-medium text-center">
              Start of the conversation
            </div>
          )}
          {messageList
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((message, index) => (
              <MessageItem message={message} key={index} />
            ))}
        </>
      ) : (
        <div className="rounded-md p-2 m-3 border-2 font-medium text-center">
          Start of the conversation
        </div>
      )}
    </div>
  );
};

export default MessageList;

// isDefinedAndHasItems(messages) ? (
//           <>
//             {!hasMoreMessages && (
//               <div className="rounded-md p-2 m-3 border-2 font-medium text-center">
//                 Start of the conversation
//               </div>
//             )}
//             {messageList
//               .sort(
//                 (a, b) =>
//                   new Date(a.createdAt).getTime() -
//                   new Date(b.createdAt).getTime()
//               )
//               .map((message, index, list) => (
//                 <MessageItem
//                   message={message}
//                   key={index}

//                 />
//               ))}
