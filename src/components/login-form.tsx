"use client";
import { toast } from "sonner";
import { SubmitButton } from "./submit-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/routes";
import { Client } from "@botpress/client";
import { storeCredentials } from "@/services/storage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "./ui";

import { MessageCircle, Lock, Bot } from "lucide-react";

export const LoginForm = () => {
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

      const result = await storeCredentials({
        token: form.token,
        workspaceId,
        botId,
      });

      if (result.success) {
        router.push(AUTH_ROUTES.MANAGEMENT.ROOT);
      } else {
        throw new Error("Failed to store credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Error al iniciar sesión, por favor verifique sus credenciales e intente de nuevo"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            ChatBox
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Inicia sesión para acceder a tu cuenta
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center">
                <Bot className="mr-2 h-4 w-4 text-muted-foreground" />
                Bot Workspace URL
              </Label>
              <Input
                type="text"
                name="url"
                id="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
                placeholder="https://app.botpress.cloud/workspaces/..."
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                Account Token
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value })}
                required
                placeholder="*********"
                className="w-full"
              />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
