import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./disable-notifications";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import DynamicFavicon from "@/components/shared/DynamicFavIcon";
import SnippetInjector from "@/components/shared/SnippetInjector";
import type { Metadata, Viewport } from "next";

const myCustomFont = localFont({
  src: [
    {
      path: "../../public/fonts/quloon.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-text-quloon",
});

const plus_Jakarta_Sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Polar Traveler - Unforgettable Arctic & Antarctic Expeditions",
    template: "%s | Polar Traveler",
  },
  description:
    "Crafting unforgettable adventures to the world's most remote destinations. Explore the Arctic and Antarctic with our expert-led expedition cruises.",
  keywords: [
    "polar expeditions",
    "Arctic cruises",
    "Antarctic cruises",
    "Svalbard tours",
    "Greenland travel",
    "expedition cruises",
    "polar travel",
    "adventure travel",
    "wildlife expeditions",
    "icebreaker cruises",
  ],
  authors: [{ name: "Polar Traveler Team" }],
  creator: "Polar Traveler",
  publisher: "Polar Traveler",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-production-domain.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Polar Traveler - Unforgettable Arctic & Antarctic Expeditions",
    description:
      "Crafting unforgettable adventures to the world's most remote destinations. Explore the Arctic and Antarctic with our expert-led expedition cruises.",
    url: "https://your-production-domain.com",
    siteName: "Polar Traveler",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "A stunning view of a polar landscape with an expedition ship.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polar Traveler - Unforgettable Arctic & Antarctic Expeditions",
    description:
      "Crafting unforgettable adventures to the world's most remote destinations. Explore the Arctic and Antarctic with our expert-led expedition cruises.",
    creator: "@PolarTraveler",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/fav.png", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Polar Traveler",
  },
  other: {
    "msapplication-TileColor": "#013a8a",
    "theme-color": "#ffffff",
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "travel",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#013a8a" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Polar Traveler",
              url: "https://your-production-domain.com", // Replace with your domain
              logo: "https://your-production-domain.com/logo.png", // Add your logo
              description:
                "Crafting unforgettable adventures to the world's most remote destinations. Explore the Arctic and Antarctic with our expert-led expedition cruises.",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "support@polartraveler.com", // Replace with your email
              },
            }),
          }}
        />
      </head>
      <body
        className={`${myCustomFont.variable} ${plus_Jakarta_Sans.variable} antialiased`}
        suppressHydrationWarning
      >
        <DynamicFavicon />
        <LanguageProvider>
          <AuthProvider>
            <SnippetInjector />

            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                },
              }}
              visibleToasts={6}
              closeButton={true}
              richColors={true}
            />
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
