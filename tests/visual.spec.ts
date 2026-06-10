import { expect, test } from "@playwright/test";

test.describe("Visual Regression Testing", () => {
	test("Homepage matches baseline", async ({ page }) => {
		// Navigate to home page
		await page.goto("/");

		// Wait for core document structure to be ready
		await page.waitForLoadState("domcontentloaded");
		await page.waitForSelector("h1", { state: "visible" });
		
		// Wait an extra brief moment for layouts to settle
		await page.waitForTimeout(1000);

		// Mask dynamic elements to prevent flaky tests
		await expect(page).toHaveScreenshot("homepage.png", {
			fullPage: true,
			animations: "disabled",
			mask: [
				page.locator(".animate-pulse"),
				page.locator("canvas"), // Mask the dynamic 3D WebGL Bins canvas
			],
			maxDiffPixelRatio: 0.05, // Allow 5% layout/rendering threshold tolerance
		});
	});

	test("Design Playground matches baseline", async ({ page }) => {
		// Navigate to design playground
		await page.goto("/design-playground");

		// Wait for layout to be ready
		await page.waitForLoadState("domcontentloaded");
		await page.waitForSelector("h1", { state: "visible" });
		
		// Wait an extra brief moment for layouts to settle
		await page.waitForTimeout(1000);

		await expect(page).toHaveScreenshot("design-playground.png", {
			fullPage: true,
			animations: "disabled",
			mask: [
				page.locator(".animate-pulse"),
				page.locator("canvas"), // Mask WebGL/Three.js 3D models
			],
			maxDiffPixelRatio: 0.05,
		});
	});
});
