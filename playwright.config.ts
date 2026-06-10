import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3001",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "desktop-chrome",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "mobile-chrome",
			use: { ...devices["Pixel 5"] },
		},
	],
	// Auto-start or hook into the dev server on port 3001
	webServer: {
		command: "pnpm run dev",
		url: "http://localhost:3001",
		reuseExistingServer: true,
		timeout: 60000,
	},
});
