import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir(".preview", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: ".preview/desktop-hero.png" });
  await page.getByRole("button", { name: "Stage 2: MRL", exact: true }).click();
  await page.waitForFunction(
    () =>
      document.querySelector(".workflow-visual")?.getAttribute("data-stage") ===
      "1",
  );
  await page.waitForTimeout(1200);
  await page.screenshot({ path: ".preview/desktop-workflow.png" });
  await page.locator("#use-cases").scrollIntoViewIfNeeded();
  await page.screenshot({ path: ".preview/desktop-use-cases.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: ".preview/mobile-hero.png" });
  await page
    .getByRole("button", { name: "Stage 3: TFHE", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      document.querySelector(".workflow-visual")?.getAttribute("data-stage") ===
      "2",
  );
  await page.waitForTimeout(1200);
  await page.screenshot({ path: ".preview/mobile-workflow.png" });
  console.log("Screenshots saved in .preview/");
} finally {
  await browser.close();
}
