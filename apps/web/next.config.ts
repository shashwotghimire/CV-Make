import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cvmake/db", "@cvmake/types", "@cvmake/ui"],
  serverExternalPackages: [
    "@prisma/client",
    "puppeteer",
    "puppeteer-core",
    "@sparticuz/chromium",
  ],
};

export default nextConfig;
