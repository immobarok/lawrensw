/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.polartraveler.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "laurensw2025.softvencefsd.xyz",
        pathname: "/backend/images/**",
      },
      {
        protocol: "https",
        hostname: "laurensw2025.softvencefsd.xyz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "heritage-expeditions.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.oceanwide-expeditions.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
