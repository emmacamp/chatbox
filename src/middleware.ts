"use server";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/routes";
import { getSession, updateSession } from "@/services/storage";
import { CredentialsClientBP } from "@/types/botpress";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = (await getSession()) as CredentialsClientBP | null;
  const pathname = request.nextUrl.pathname;

  if (session) {
    updateHeadersInterceptor(NextResponse.next(), session);
    if (
      pathname === PUBLIC_ROUTES.AUTH.LOGIN ||
      pathname === PUBLIC_ROUTES.ROOT
    ) {
      return NextResponse.redirect(
        new URL(AUTH_ROUTES.MANAGEMENT.ROOT, request.url)
      );
    }

    // if ()
    return updateSession(request);
  } else {
    if (
      pathname !== PUBLIC_ROUTES.AUTH.LOGIN &&
      pathname !== PUBLIC_ROUTES.ROOT
    ) {
      return NextResponse.redirect(
        new URL(PUBLIC_ROUTES.AUTH.LOGIN, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/management/:path*"],
  unstable_allowDynamic: [
    "/src/services/storage.ts",
    "/node_modules/@botpress/client/dist/*",
  ],
};

const updateHeadersInterceptor = (
  response: NextResponse,
  session: CredentialsClientBP
) => {
  if (session?.token) {
    response.headers.set("Authorization", `Bearer ${session.token}`);
  }
};
