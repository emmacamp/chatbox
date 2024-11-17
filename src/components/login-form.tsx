"use client";
import { toast } from "sonner";
import { SubmitButton } from "./submit-button";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/routes";
import { Client } from "@botpress/client";
import { storeCredentials } from "@/services/storage";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label } from "./ui";

export const LoginForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [form, setForm] = useState({ url: "", token: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!form.token || !form.url) {
        throw new Error("All fields are required");
      }

      const splittedURL = form.url.split("/");
      const workspaceId = splittedURL[4];
      const botId = splittedURL[6];

      if (!workspaceId || !botId) {
        throw new Error("Invalid URL format");
      }

      const client = new Client({
        token: form.token,
        workspaceId,
        botId,
      });

      if (!client) {
        throw new Error("Failed to create client, validate your credentials");
      }

      const result = await storeCredentials(
        {
          token: form.token,
          workspaceId,
          botId,
        },
        JSON.stringify(client)
      );

      if (result.success) {
        toast.success("Credentials stored successfully");
        router.push(AUTH_ROUTES.MANAGEMENT.ROOT);
      } else {
        throw new Error("Failed to store credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error(error || "Something went wrong, please try again.");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={ref} onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bot URL
            </Label>
            <Input
              type="text"
              name="url"
              id="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="https://app.botpress.cloud/workspaces/..."
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              API Token
            </Label>
            <Input
              type="password"
              name="token"
              id="token"
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Enter your API token"
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
};
