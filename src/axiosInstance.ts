"use server";
import axios from "axios";
import { getSession } from "./services/storage";
import { CredentialsClientBP } from "./types/botpress";

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: "https://api.botpress.cloud/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Agregar un interceptor de solicitud
axiosInstance.interceptors.request.use(
  async (config) => {
    const { token, workspaceId, botId } = (await getSession())
      ?.credentials as CredentialsClientBP;

    // Si hay un token, agregarlo a los encabezados
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Agregar otros encabezados según sea necesario
    if (botId) {
      config.headers["x-bot-id"] = botId;
    }

    if (workspaceId) {
      config.headers["x-workspace-id"] = workspaceId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
