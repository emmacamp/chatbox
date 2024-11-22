import ChatInterface from "@/components/ChatInterface";
import { getSession } from "@/services/storage";
import { CredentialsClientBP } from "@/types/botpress";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const conversationId = (await params).slug;

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
