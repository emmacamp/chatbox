"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui";
import { ArrowRight, Loader } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full flex items-center justify-center space-x-2"
      disabled={pending}
    >
      {pending ? (
        <Loader className="w-4 h-4 text-primary-foreground animate-spin" />
      ) : (
        <>
          <span>Iniciar Sesi&oacute;n</span>
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
