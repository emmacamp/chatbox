import axiosInstance from "@/axiosInstance";
import { getSession } from "./storage";
// import { CredentialsClientBP } from "@/types/botpress";
import type { Bot } from "@botpress/client";
import axios, { AxiosError } from "axios";
import { CredentialsClientBP } from "@/types/botpress";
import { ENDPOINTS } from "./endpoints";

export async function getBotInfo(botId: string): Promise<Bot | undefined> {
  try {
    const responseApi = await axiosInstance.get(`/admin/bots/${botId}`);
    return responseApi.data.bot as Bot;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function getBotAnalytics({
  botId,
  startDate,
  endDate,
}: {
  botId: string;
  startDate: string;
  endDate: string;
}) {
  // encoder dates
  const encodedStartDate = encodeURIComponent(startDate);
  const encodedEndDate = encodeURIComponent(endDate);

  try {
    const credentials = (await getSession())
      ?.credentials as CredentialsClientBP;

    const response = await axios.get(
      ENDPOINTS.BOT.GET.ANALYTICS(botId, encodedStartDate, encodedEndDate),
      {
        headers: {
          Authorization: `Bearer ${credentials?.token}`,
          "x-bot-id": credentials?.botId,
          "x-workspace-id": credentials?.workspaceId,
        },
      }
    );
    return {
      analytics: response.data,
      success: true,
      message: "Datos obtenidos correctamente",
    };
  } catch (error) {
    const errorAxios = error as AxiosError;
    console.error(errorAxios);
    return {
      analytics: null,
      success: false,
      message: errorAxios?.message || "Error al obtener los datos",
    };
  }
}

export const getConversations = async (botId: string) => {
  const credentials = (await getSession())?.credentials as CredentialsClientBP;
  try {
    const responseApi = await axiosInstance.get(
      `/chat/conversations?botId=${botId}`,
      {
        headers: {
          Authorization: `Bearer ${credentials?.token}`,
          "x-bot-id": credentials?.botId,
          "x-workspace-id": credentials?.workspaceId,
        },
      }
    );
    const conversations = responseApi.data;

    console.log({ conversations });
  } catch (error) {
    console.error(error);
  }
};
