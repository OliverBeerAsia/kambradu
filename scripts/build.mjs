import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const demoFlags = ["KAMBRADU_DEMO_AUTH_ENABLED", "NEXT_PUBLIC_KAMBRADU_DEMO_AUTH_ENABLED"];
const enabledFlag = demoFlags.find((name) => process.env[name] === "true");

if (enabledFlag) {
  console.error(`Production build refused: ${enabledFlag} must be unset or false.`);
  process.exit(1);
}

let releaseSha = "unknown";
try {
  releaseSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
} catch {
  releaseSha = process.env.GITHUB_SHA ?? "unknown";
}

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const result = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    KAMBRADU_RELEASE_SHA: process.env.KAMBRADU_RELEASE_SHA ?? releaseSha,
    KAMBRADU_BUILD_DATE: process.env.KAMBRADU_BUILD_DATE ?? new Date().toISOString(),
    KAMBRADU_RELEASE_ENV: process.env.KAMBRADU_RELEASE_ENV ?? "local-production"
  }
});

process.exit(result.status ?? 1);
