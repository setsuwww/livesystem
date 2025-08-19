declare module "next-pwa" {
  import type { NextConfig } from "next";
  const withPWA: (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
