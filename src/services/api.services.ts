import axiosInstance from "@/axiosInstance";
// import { getSession } from "./storage";
// import { CredentialsClientBP } from "@/types/botpress";
import type { Bot } from "@botpress/client";

export async function getBotInfo(botId: string): Promise<Bot | undefined> {
  try {
    const responseApi = await axiosInstance.get(`/admin/bots/${botId}`);
    const botInfo = responseApi.data.bot as Bot;

    console.log({ botInfo });

    return botInfo;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export const getConversations = async (botId: string) => {
  try {
    const responseApi = await axiosInstance.get(
      `/chat/conversations?botId=${botId}`
    );
    const conversations = responseApi.data;

    console.log({ conversations });
  } catch (error) {
    console.error(error);
  }
};
