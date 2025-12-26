"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FooterWrapper from "./Footer/FooterWrapper";

// Dynamically import server components to avoid SSR issues
const Navbar = dynamic(() => import("./Navbar/Navbar.server"), {
  ssr: false,
  loading: () => <div className=""></div>,
});

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle case where pathname might be null
  const currentPath = pathname || "";

  const isAuthRoute =
    currentPath.startsWith("/login") ||
    currentPath.startsWith("/signup") ||
    currentPath.startsWith("/forgot-password") ||
    currentPath.startsWith("/reset-password") ||
    currentPath.startsWith("/verify-otp");

  const isHome = currentPath === "/";

  // Prevent hydration mismatch
  if (!mounted) {
    return <main className="bg-white">{children}</main>;
  }

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main className="bg-white min-h-screen">{children}</main>
      {!isAuthRoute && <FooterWrapper isHome={isHome} />}
    </>
  );
}
