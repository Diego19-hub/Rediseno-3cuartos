import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir:"./tests/e2e", use:{baseURL:"http://localhost:3000",channel:"chrome",trace:"retain-on-failure"}, webServer:{command:"npm run dev -- --hostname localhost",url:"http://localhost:3000",reuseExistingServer:!process.env.CI}, outputDir:"artifacts/test-results" });
