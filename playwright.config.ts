import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 45_000,
  workers: 1,
  expect: { timeout: 7_000 },
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:3217",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3217",
    url: "http://127.0.0.1:3217/status",
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }]
});
