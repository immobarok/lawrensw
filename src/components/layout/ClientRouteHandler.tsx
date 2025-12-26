"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface ClientRouteHandlerProps {
  pathname: string;
}

export default function ClientRouteHandler({ pathname }: ClientRouteHandlerProps) {
  const clientPathname = usePathname();

  useEffect(() => {
    if (pathname !== clientPathname) {
      window.location.reload();
    }
  }, [pathname, clientPathname]);

  return null;
}