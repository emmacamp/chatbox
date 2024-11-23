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

export interface UserBP {
  id: string;
  createdAt: string;
  updatedAt: string;
  tags: {
    [key: string]: string;
  };
  name: string;
}

export interface GetBotAnalyticsResponseBP {
  records: {
    /**
     * ISO 8601 date string of the beginning (inclusive) of the period
     */
    startDateTimeUtc: string;
    /**
     * ISO 8601 date string of the end (exclusive) of the period
     */
    endDateTimeUtc: string;
    returningUsers: number;
    newUsers: number;
    sessions: number;
    /**
     * Deprecated. Use `userMessages` instead.
     */
    messages: number;
    userMessages: number;
    botMessages: number;
    events: number;
    eventTypes: {
      [k: string]: number;
    };
    customEvents: {
      [k: string]: number;
    };
    llm: {
      calls: number;
      errors: number;
      inputTokens: number;
      outputTokens: number;
      /**
       * The time it took for the LLM to complete its response. Values are expressed in milliseconds
       */
      latency: {
        mean: number;
        sd: number;
        min: number;
        max: number;
      };
      /**
       * LLM response generation speed expressed in output tokens per second.
       */
      tokensPerSecond: {
        mean: number;
        sd: number;
        min: number;
        max: number;
      };
      /**
       * Values are expressed in U.S. dollars
       */
      cost: {
        sum: number;
        mean: number;
        sd: number;
        min: number;
        max: number;
      };
    };
  }[];
}

export interface CreateMessageRequestBodyBP {
  /**
   * Payload is the content type of the message. Accepted payload options: Text, Image, Choice, Dropdown, Card, Carousel, File, Audio, Video, Location
   */
  payload: {
    [k: string]: any;
  };
  /**
   * ID of the [User](#schema_user)
   */
  userId: string;
  /**
   * ID of the [Conversation](#schema_conversation)
   */
  conversationId: string;
  /**
   * Type of the [Message](#schema_message) represents the resource type that the message is related to
   */
  type: string;
  /**
   * Set of [Tags](/docs/developers/concepts/tags) that you can attach to a [Message](#schema_message). The set of [Tags](/docs/developers/concepts/tags) available on a [Message](#schema_message) is restricted by the list of [Tags](/docs/developers/concepts/tags) defined previously by the [Bot](#schema_bot). Individual keys can be unset by posting an empty value to them.
   */
  tags: {
    [k: string]: string;
  };
  /**
   * Schedule the Message to be sent at a specific time. Either dateTime or delay must be provided.
   */
  schedule?: {
    /**
     * When the [Message](#schema_message) will be sent, in the ISO 8601 format
     */
    dateTime?: string;
    /**
     * Delay in milliseconds before sending the [Message](#schema_message)
     */
    delay?: number;
  };
}
