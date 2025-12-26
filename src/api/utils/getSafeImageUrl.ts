export function getSafeImageUrl(url?: string) {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return "/placeholder.jpg";
}
