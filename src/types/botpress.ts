import { Client } from "@botpress/client";

export interface TextPayloadBP {
  text: string;
  metadata?: string;
}

export interface ChoicePayloadBP {
  text: string;
  options: { label: string; value: string }[];
}

export interface QuickReplyPayloadBP {
  payload: {
    text: string;
    type: string;
    value: string;
  };
}

export type CustomClientBP = (
  token: string,
  workspaceId: string,
  botId: string
) => Client;

export interface CredentialsClientBP {
  token: string;
  workspaceId: string;
  botId: string;
}

// {
//     "id": "conv_01JCRCRJTD2CEQJ8V66CSRMBKQ",
//     "createdAt": "2024-11-15T17:08:35.277Z",
//     "updatedAt": "2024-11-15T18:09:06.598Z",
//     "channel": "channel",
//     "integration": "whatsapp",
//     "tags": {
//         "whatsapp:userPhone": "18298160824",
//         "whatsapp:phoneNumberId": "495238420330533"
//     }
// }

export interface ConversationBP {
  id: string;
  createdAt: string;
  updatedAt: string;
  channel: string;
  integration: string;
  tags: {
    [key: string]: string;
  };
}

// Mensaje
// {
//     "id": "dc13aa15-31cf-43ee-9528-302882257a10",
//     "createdAt": "2024-11-15T17:08:35.388Z",
//     "conversationId": "conv_01JCRCRJTD2CEQJ8V66CSRMBKQ",
//     "payload": {
//         "text": "Buenas tardes"
//     },
//     "tags": {
//         "whatsapp:id": "wamid.HBgLMTgyOTgxNjA4MjQVAgASGCA4MzA3MjE2MUMyODg3ODY1OTNFRDgxODUzMENEMjgwRAA="
//     },
//     "userId": "user_01JCRCRJWCFTB0ZBY49NKE9EMC",
//     "type": "text",
//     "direction": "incoming"
// }
export interface MessageBP {
  id: string;
  createdAt: string;
  conversationId: string;
  payload: {
    text: string;
  };
  tags: {
    [key: string]: string;
  };
  userId: string;
  type: string;
  direction: string;
}

// user
// {
//   "id": "user_01JC9HSF8ZBJTJR37WW3VCSRQ7",
//   "createdAt": "2024-11-09T22:47:50.815Z",
//   "updatedAt": "2024-11-09T22:47:50.815Z",
//   "tags": {
//     "whatsapp:userId": "18297721111",
//     "whatsapp:name": "Emmanuel Popa"
//   },
//   "name": "Emmanuel Popa"
// }

export interface UserBP {
  id: string;
  createdAt: string;
  updatedAt: string;
  tags: {
    [key: string]: string;
  };
  name: string;
}
