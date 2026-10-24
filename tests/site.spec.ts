import { test, expect } from "@playwright/test";

test("renders all sections, local assets and the litepaper without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Breakthroughs.",
  );
  for (const id of [
    "trust-crisis",
    "workflow-scroll-track",
    "pillars",
    "use-cases",
    "security",
    "foundation",
  ])
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  expect((await page.request.get("/logo.svg")).status()).toBe(200);
  await page.locator(".header-cta").click();
  await expect(page).toHaveURL(/litepaper/);
  await expect(
    page.getByText("Architecture draft", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "03 / Security model" }),
  ).toBeAttached();
  expect(errors).toEqual([]);
});

test("journey controls move through all six stages and reverse correctly", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".hero-actions .button-primary").click();
  const labels = ["Local", "MRL", "TFHE", "Escrow", "Match", "NDA"];
  for (const index of [0, 1, 2, 3, 4, 5, 0]) {
    const button = page.getByRole("button", {
      name: `Stage ${index + 1}: ${labels[index]}`,
      exact: true,
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-current", "step");
    await expect(page.locator(".workflow-visual")).toHaveAttribute(
      "data-stage",
      String(index),
    );
    await expect(page.locator(".scene-layer.is-visible")).toHaveCount(1);
  }
});

test("scroll thresholds drive progressive matching and reverse to pending", async ({
  page,
}) => {
  await page.goto("/");
  // Let Lenis initialize before driving the native position used by ScrollTrigger.
  await page
    .getByRole("button", { name: "Stage 5: Match", exact: true })
    .click();
  await expect(page.locator(".workflow-visual")).toHaveAttribute(
    "data-stage",
    "4",
  );
  // A stage becomes active before its smooth navigation finishes. Wait for
  // Lenis to settle so a native test scroll is not overwritten by that tween.
  await expect(page.locator("html")).not.toHaveClass(/lenis-scrolling/);
  for (const [progress, passed] of [
    [0.73, 1],
    [0.78, 2],
    [0.83, 2],
    [0.7, 0],
  ]) {
    await page.evaluate((value) => {
      const track = document.querySelector<HTMLElement>(
        "#workflow-scroll-track",
      )!;
      window.scrollTo(
        0,
        track.offsetTop + (track.offsetHeight - innerHeight) * value,
      );
    }, progress);
    await expect(
      page
        .locator(".scene-layer.is-visible")
        .getByText("PASSED", { exact: true }),
    ).toHaveCount(passed);
    if (progress === 0.83)
      await expect(
        page
          .locator(".scene-layer.is-visible")
          .getByText("CONFIRMED", { exact: true }),
      ).toBeVisible();
  }
});

test("sector tabs support mouse and keyboard selection", async ({ page }) => {
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await tabs.nth(1).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Strategic alignment.",
  );
  await tabs.nth(1).press("ArrowRight");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText(
    "Separate discoveries.",
  );
  await tabs.nth(2).press("End");
  await expect(page.getByRole("tabpanel")).toContainText("Out of the silo.");
  await tabs.nth(3).press("Home");
  await expect(page.getByRole("tabpanel")).toContainText("Your catalyst.");
});

test("mobile navigation, workflow and page fit a narrow screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "The protocol" })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page
    .getByRole("button", { name: "Stage 3: TFHE", exact: true })
    .click();
  await expect(page.locator(".workflow-visual")).toHaveAttribute(
    "data-stage",
    "2",
  );
  const bounds = await page.locator(".journey-nav").boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("reduced motion exposes every step without the long scroll track", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".workflow-track")).toHaveClass(/reduced-motion/);
  expect(
    await page.locator(".workflow-track").evaluate((el) => el.clientHeight),
  ).toBeLessThan(1500);
  await page.getByRole("button", { name: "Stage 6: NDA", exact: true }).click();
  await expect(page.locator(".workflow-visual")).toHaveAttribute(
    "data-stage",
    "5",
  );
  await expect(page.locator(".stage-narrative h2")).toContainText(
    "Single-Bit Reveal",
  );
  await page
    .getByRole("button", { name: "Stage 1: Local", exact: true })
    .click();
  await expect(page.locator(".workflow-visual")).toHaveAttribute(
    "data-stage",
    "0",
  );
});

test("small phone keeps the workflow controls in the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await page.getByRole("button", { name: "Stage 2: MRL", exact: true }).click();
  await expect(page.locator(".workflow-visual")).toHaveAttribute(
    "data-stage",
    "1",
  );
  const bounds = await page.locator(".journey-nav").boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(568);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("hero headline remains fully readable at narrow mobile widths", async ({
  page,
}) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator("h1").evaluate((heading) => {
      const range = document.createRange();
      range.selectNodeContents(heading);
      return Array.from(range.getClientRects(), (rect) => ({
        left: rect.left,
        right: rect.right,
      }));
    });
    for (const rect of bounds) {
      expect(rect.left).toBeGreaterThanOrEqual(0);
      expect(rect.right).toBeLessThanOrEqual(width);
    }
  }
});
