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
      toast.error("Something went wrong, please try again.");
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
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
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
                Workspace token
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

      {/* Fondo con formas abstractas */}
      <div className="fixed top-0 right-0 -z-10 opacity-30">
        <div className="w-96 h-96 bg-accent rounded-full filter blur-3xl"></div>
      </div>
      <div className="fixed bottom-0 left-0 -z-10 opacity-30">
        <div className="w-96 h-96 bg-secondary rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};
//  <Card className="mx-auto max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl">Login</CardTitle>
//         <CardDescription>
//           Enter your email below to login to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form ref={ref} onSubmit={handleSubmit} className="grid gap-4">
//           <div className="grid gap-2">
//             <Label
//               htmlFor="url"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Bot URL
//             </Label>
//             <Input
//               type="text"
//               name="url"
//               id="url"
//               value={form.url}
//               onChange={(e) => setForm({ ...form, url: e.target.value })}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
//               placeholder="https://app.botpress.cloud/workspaces/..."
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label
//               htmlFor="token"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               API Token
//             </Label>
//             <Input
//               type="password"
//               name="token"
//               id="token"
//               value={form.token}
//               onChange={(e) => setForm({ ...form, token: e.target.value })}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
//               placeholder="Enter your API token"
//             />
//           </div>

//           <SubmitButton />
//         </form>
//       </CardContent>
//     </Card>
