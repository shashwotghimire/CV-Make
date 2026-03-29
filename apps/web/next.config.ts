import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cvmake/db", "@cvmake/types", "@cvmake/ui"],
  serverExternalPackages: [
    "@prisma/client",
    "puppeteer",
    "puppeteer-core",
  ],
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/.pnpm/@sparticuz+chromium@*/node_modules/@sparticuz/chromium/bin/**",
    ],
  },
};

export default nextConfig;
