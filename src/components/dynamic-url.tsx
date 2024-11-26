"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AUTH_ROUTES } from "@/routes";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export const DynamicUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = pathname.split("/")[2];

  const userName = searchParams.get("userName");
  const integration = searchParams.get("integration");

  console.log({ userName, integration });
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href={AUTH_ROUTES.MANAGEMENT.ROOT}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="hidden md:block text-muted-foreground">
          <BreadcrumbPage className="text-inherit capitalize">
            {location || "Dashboard"}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {userName || integration || "Analíticas"}{" "}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
        {/* ) : null} */}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
