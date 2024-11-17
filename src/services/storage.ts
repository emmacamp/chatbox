"use server";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { CredentialsClientBP } from "../types/botpress";
import { Client } from "@botpress/client";
import { NextRequest, NextResponse } from "next/server";

interface Session {
  credentials: CredentialsClientBP;
  client: Client;
  expires: Date;
  iat: number;
  exp: number;
}

// Constantes
const CREDENTIALS_COOKIE_NAME = "bp-inbox-credentials-gp";

const secretKey = process.env.AUTH_SECRET || "";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload): Promise<string> {
  const encrypted = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);

  return encrypted;
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Decryption error:", error);
  }
}

// Función auxiliar para obtener una cookie
const getCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
};

// Función auxiliar para establecer una cookie
export const setCookie = async (name: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value);
};

// Función auxiliar para eliminar una cookie
const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

export async function createClient(
  token: string,
  workspaceId: string,
  botId: string
): Promise<Client | null> {
  try {
    const client = new Client({ token, workspaceId, botId });

    return client;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export async function getSession(): Promise<Session | JWTPayload | null> {
  const session = (await getCookie(CREDENTIALS_COOKIE_NAME)) as string;

  if (!session) return null;
  const parsed = await decrypt(session);
  return {
    ...parsed,
    client: JSON.parse(parsed.client),
  };
}

export async function extractAndDecryptCredentials(
  value: string
): Promise<CredentialsClientBP | null> {
  try {
    if (!value) {
      return null;
    }

    const decryptedCredentialsString = await decrypt(value);

    if (!decryptedCredentialsString) {
      return null;
    }

    const credentials = JSON.parse(decryptedCredentialsString);

    if (!credentials) {
      return null;
    }

    if (!credentials.token || !credentials.workspaceId || !credentials.botId) {
      return null;
    }

    return {
      token: credentials.token,
      workspaceId: credentials.workspaceId,
      botId: credentials.botId,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// export async function getStoredCredentials(
//   itemName: string = CREDENTIALS_COOKIE_NAME
// ): Promise<CredentialsClientBP | null> {
//   try {
//     const credentialsEncrypted = await getCookie(itemName);

//     if (!credentialsEncrypted) {
//       return null;
//     }

//     const credentialsDecrypted =
//       extractAndDecryptCredentials(credentialsEncrypted);
//     return credentialsDecrypted;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

export async function storeCredentials(
  credentials: CredentialsClientBP,
  client: string,
  itemName: string = CREDENTIALS_COOKIE_NAME
): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  try {
    const expires = new Date(Date.now() + 10 * 1000);
    const session = await encrypt({ credentials, client, expires });

    cookieStore.set(itemName, session, { expires, httpOnly: true });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
    };
  }
}

export async function clearStoredCredentials(
  itemName: string = CREDENTIALS_COOKIE_NAME
): Promise<void> {
  try {
    deleteCookie(itemName);
  } catch (error) {
    console.error(error);
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(CREDENTIALS_COOKIE_NAME)?.value;
  if (!session) return NextResponse.next(); // Return response if there is no session

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
  const res = NextResponse.next();

  res.cookies.set({
    name: CREDENTIALS_COOKIE_NAME,
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });

  return res;
}
