import { headers } from "next/headers";

export async function getServerSidePathname(): Promise<string> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";
  return pathname;
}
