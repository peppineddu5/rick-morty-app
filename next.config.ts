import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return process.env.ENVIROMENT === "development"
      ? [
          {
            source: "/character/image/:id",
            destination: `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace(".cloud", ".site")}/character/image/:id`,
          },
        ]
      : [];
  },
};

export default nextConfig;
