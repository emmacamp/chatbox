import { logout } from "@/services/storage";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  return (
    <form action={async () => await logout()}>
      <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground p-3 text-sm font-medium hover:bg-primary/90 hover:bg-opacity-30 ">
        <LogOut className="w-6" />
        <span className="text-center">Cerrar Sesión</span>
      </button>
    </form>
  );
};
