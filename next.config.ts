  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    // Ensure we're not doing static export - we need Node.js runtime for API routes
    output: undefined,
  };

  export default nextConfig;
