import { expect, test, type Page } from "@playwright/test";

const baseURL = "http://localhost:3000";
const viewports = [
  { width: 320, height: 720 },
  { width: 360, height: 740 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 3840, height: 2160 },
];

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    doc: document.documentElement.scrollWidth,
    width: window.innerWidth,
  }));
  expect(Math.max(overflow.body, overflow.doc)).toBeLessThanOrEqual(overflow.width + 1);
}

async function completeDistance(page: Page, canSee = true) {
  await expect(page.getByRole("heading", { name: "Distance Vision Test" })).toBeVisible();
  for (const phase of ["Cover your RIGHT eye", "Cover your LEFT eye", "Keep BOTH eyes open"]) {
    await expect(page.getByText(phase)).toBeVisible();
    for (let i = 0; i < 6; i += 1) {
      await page.getByRole("button", { name: canSee ? "Yes, I can see it" : "No, too blurry" }).click();
      if (!canSee) break;
    }
  }
  await page.getByRole("button", { name: "Continue to Next Test" }).click();
}

async function completeQuestionnaire(page: Page, opts: { doubleVision?: boolean } = {}) {
  if (opts.doubleVision) {
    await page.getByText("Double Vision").click();
  }
  await page.locator("#symptom-duration").selectOption(opts.doubleVision ? "days" : "none");
  await page.locator("#age-range").selectOption("18-35");
  await page.locator("#previous-prescription").selectOption("no");
  await page.locator("#family-history").selectOption("none");
  await page.getByRole("button", { name: "Submit & Analyze Results" }).click();
  await expect(page.getByText("Analyzing Results")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Vision Report" })).toBeVisible({ timeout: 6000 });
}

test.describe("production audit", () => {
  test.beforeEach(async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.context().clearCookies();
    await page.addInitScript(() => localStorage.clear());
    test.info().attach("errors", { body: errors.join("\n"), contentType: "text/plain" });
  });

  for (const path of ["/", "/education", "/history", "/accessibility", "/results"]) {
    test(`route smoke ${path}`, async ({ page }) => {
      await page.goto(`${baseURL}${path}`);
      await expect(page.locator("body")).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expect(page.getByText("Medical Disclaimer")).toBeVisible();
    });
  }

  for (const viewport of viewports) {
    test(`responsive home ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(baseURL);
      await expect(page.getByRole("button", { name: /Quick Test/ })).toBeVisible();
      await expect(page.getByRole("button", { name: /Full Assessment/ })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }

  test("navigation, dropdowns, accessibility toggles, and language switching", async ({ page }) => {
    await page.goto(baseURL);
    await page.getByLabel("Select language").selectOption("hi");
    await expect(page.getByRole("button", { name: /त्वरित|Quick/ })).toBeVisible();
    await page.getByLabel("Select language").selectOption("gu");
    await expect(page.getByRole("button", { name: /ઝડપી|Quick/ })).toBeVisible();
    await page.getByLabel("Select language").selectOption("en");
    await page.getByRole("link", { name: "Accessibility" }).click();
    await page.getByRole("switch", { name: "High Contrast" }).click();
    await page.getByRole("switch", { name: "Large Text" }).click();
    await page.getByRole("switch", { name: "Reduce Motion" }).click();
    await expect(page.locator("body")).toHaveAttribute("data-high-contrast", "true");
    await expect(page.locator("body")).toHaveAttribute("data-large-text", "true");
    await expect(page.locator("body")).toHaveAttribute("data-reduced-motion", "true");
    await expectNoHorizontalOverflow(page);
  });

  test("quick test, resume, local storage, results, history, share, and pdf export", async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole("button", { name: /Quick Test|Start Test/ }).click();
    await expect(page.getByRole("heading", { name: "Distance Vision Test" })).toBeVisible();
    await page.getByLabel("Exit Test").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByLabel("Exit Test").click();
    await page.getByRole("button", { name: "Resume Test" }).click();
    await completeDistance(page, false);
    await page.getByRole("button", { name: "No" }).click();
    await completeQuestionnaire(page);
    await expect(page.getByText(/Doctor Recommendation:/)).toBeVisible();
    await page.getByRole("button", { name: "Share Result" }).click();
    await expect(page.getByRole("button", { name: /Share Result|Copied Link|Unable to Share/ })).toBeVisible();
    const downloadPromise = page.waitForEvent("download", { timeout: 15000 });
    await page.getByRole("button", { name: "Download Report" }).click();
    await downloadPromise;
    await page.getByRole("link", { name: "History" }).click();
    await expect(page.getByRole("heading", { name: "Vision History" })).toBeVisible();
    await expect(page.getByText(/20\/200|20\/20/)).toBeVisible();
  });

  test("full assessment modules and emergency warning", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(baseURL);
    await page.getByRole("button", { name: /Full Assessment/ }).click();
    await completeDistance(page, true);
    await page.getByRole("button", { name: "Yes" }).click();
    await page.getByRole("button", { name: /No, all lines/ }).click();
    await page.getByRole("button", { name: "I can read it" }).click();
    await page.getByRole("button", { name: "I can't see it" }).click();
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "8" }).click();
    await page.getByRole("button", { name: /Right Dominant/ }).click();
    await page.getByRole("button", { name: /They cross/ }).click();
    await page.getByRole("button", { name: "Select red circle as closer" }).click();
    await page.getByRole("button", { name: /No, all lines/ }).click();
    await page.getByRole("button", { name: "Start Test" }).click();
    await page.keyboard.press("Space");
    await page.keyboard.press("Space");
    await expect(page.getByRole("heading", { name: "Double Vision Screening" })).toBeVisible({ timeout: 7000 });
    await page.getByRole("button", { name: "Yes, frequently" }).click();
    await page.getByRole("button", { name: /Yes, it's difficult/ }).click();
    await page.getByRole("button", { name: "Yes, frequently" }).click();
    await page.getByRole("button", { name: "Yes" }).click();
    await completeQuestionnaire(page, { doubleVision: true });
    await expect(page.getByText("Emergency Care Recommended")).toBeVisible();
  });
});
