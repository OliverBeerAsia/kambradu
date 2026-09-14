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
  /**
   * GitHub Pages serves a project site under /<repo>, so the build takes an
   * optional base path from the environment. Local builds and the smoke
   * suite run at the root, unchanged. Anything that names an asset by a
   * root-absolute path goes through withBasePath() in src/lib/base-path.ts.
   */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true
};

export default nextConfig;
