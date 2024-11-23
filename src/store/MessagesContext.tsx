// context/MessagesContext.tsx
import { Message } from "@botpress/client";
import React, { createContext, useState, useContext, ReactNode } from "react";

// Definición de la interfaz para un mensaje

// Definición de la interfaz para el contexto
interface MessagesContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

// Creación del contexto con valores por defecto
const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

// Proveedor del contexto
export const MessagesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <MessagesContext.Provider value={{ messages, addMessage, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useMessages = (): MessagesContextType => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};
