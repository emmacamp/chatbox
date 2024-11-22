"use server";

import { revalidateTag } from "next/cache";

export const revalidateTagChat = async () => {
  revalidateTag("chat");
};

export const revalidatePathClient = async (path: string) => {
  revalidateTag(path);
};
