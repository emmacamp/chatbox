import ChatInterface from "@/components/ChatInterface";
import { getSession } from "@/services/storage";
import { CredentialsClientBP } from "@/types/botpress";

type Params = Promise<{ conversationId: string }>;

export const metadata = {
  title: "Chat | ChatBox",
  description: "Aplicación para gestion de conversaciones de AI Agents.",
};

export default async function Page({ params }: { params: Params }) {
  const { conversationId } = await params;
  const credentials = (await getSession())?.credentials as CredentialsClientBP;

  return (
    <div className="flex flex-col h-full">
      <ChatInterface
        conversationId={conversationId}
        credentials={credentials}
      />
    </div>
  );
}
