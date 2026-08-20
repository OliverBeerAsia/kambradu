import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static files, no server.
   *
   * Everything a learner creates lives in their own browser, and the words are
   * bundled at build time, so there is nothing for a server to do. Exporting
   * means the site is a CDN download rather than a running process: no cold
   * starts, no hosting bill, and the least possible work for an old phone on a
   * slow connection.
   */
  output: "export",
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true
};

export default nextConfig;
