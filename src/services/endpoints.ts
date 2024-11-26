const API_URL =
  process.env.NEXT_PUBLIC_API_URL + "/v1" || "http://localhost:3000";

//   const url = `https://api.botpress.cloud/v1/chat/conversations`;

export const ENDPOINTS = {
  BOT: {
    GET: {
      CURRENT_BOT: (botId: string) => `${API_URL}/admin/bots/${botId}`,
      CONVERSATIONS: `${API_URL}/chat/conversations`,
    },
  },
};
