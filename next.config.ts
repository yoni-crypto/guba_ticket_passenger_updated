import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
      {
        protocol:"https",
        hostname:"images.pexels.com"
      },
      {
        protocol:"https",
        hostname:"t3.ftcdn.net"
      },
      {
        protocol:"https",
        hostname:"t4.ftcdn.net"
      },
      {
        protocol:"https",
        hostname:"media.istockphoto.com"
      },
      {
        protocol:"https",
        hostname:"addisfortune.news"
      }

    ],
  },
};

export default nextConfig;
