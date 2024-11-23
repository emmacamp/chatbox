import { getSession } from "@/services/storage";
import DashboardPage from "./dashboard/page";
import { CredentialsClientBP } from "@/types/botpress";

export default async function Page() {

  const credentials = (await getSession())?.credentials as CredentialsClientBP;
  return <DashboardPage credentials={credentials} />;
}
