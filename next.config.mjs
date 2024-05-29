const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // unoptimized: true,
  },
  experimental: {
    reactCompiler: isProd,
  },
  output: "standalone",
  // ...
};

export default nextConfig;
