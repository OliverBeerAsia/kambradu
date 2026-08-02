import { expect, test, type Page } from "@playwright/test";

async function completeSabang(page: Page, keep = true) {
  await page.goto("/practice?lesson=shop-visit");
  await expect(page.getByRole("heading", { name: "sabang" })).toBeVisible();
  await expect(page.getByText(/pronounce|say it|recording prompt/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "soap", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("It means soap");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Your answer").fill("sabang");
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("status")).toContainText("matches the dictionary form");
  await page.getByRole("button", { name: "Got it" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "At home" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Keep sabang in Memories?" })).toBeVisible();
  await page.getByRole("button", { name: keep ? "Keep in Memories" : "Finish without saving" }).click();
  await expect(page.getByRole("heading", { name: "You reviewed sabang." })).toBeVisible();
}

test("the public shell has exactly three learner destinations", async ({ page }) => {
  await page.goto("/");
  const primary = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(primary.getByRole("link")).toHaveCount(3);
  await expect(primary.getByRole("link").allTextContents()).resolves.toEqual(["Today", "Learn", "Memories"]);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Start" })).toBeVisible();
  await expect(page.getByText("Saved in this browser")).toBeVisible();
});

test("Learn offers only the two source-checked text lessons", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.getByRole("heading", { name: "Learn a word." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Learn sabang" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Learn janela" })).toBeVisible();
  await expect(page.getByText("Checked against the dictionary")).toHaveCount(2);
  await expect(page.locator("audio")).toHaveCount(0);
  await page.getByText("Sources", { exact: true }).click();
  await expect(page.getByText(/Not yet checked with a speaker or community partner/i)).toBeVisible();
});

test("a complete written learning loop saves an editable memory", async ({ page }) => {
  await completeSabang(page, true);
  await page.getByRole("link", { name: "Done" }).click();
  await page.goto("/memories");
  await expect(page.getByText("sabang", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /sabang soap/i }).click();
  await page.getByLabel("Personal context").fill("Beside the kitchen sink");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Saved in this browser.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Practise this word" })).toBeVisible();
});

test("practice resumes the same lesson and step after reload", async ({ page }) => {
  await page.goto("/practice?lesson=home-objects");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "What does janela mean?" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "What does janela mean?" })).toBeVisible();
});

test("repeat practice works after completion without saving a memory", async ({ page }) => {
  await completeSabang(page, false);
  await page.getByRole("button", { name: "Practise again" }).click();
  await expect(page.getByRole("heading", { name: "sabang" })).toBeVisible();
  await page.goto("/memories");
  await expect(page.getByRole("heading", { name: "No memories yet." })).toBeVisible();
});

test("Memories starts empty and supports add, edit, export and delete", async ({ page }) => {
  await page.goto("/memories");
  await expect(page.getByRole("heading", { name: "No memories yet." })).toBeVisible();
  await page.getByRole("link", { name: "Add a memory" }).click();
  await page.getByRole("button", { name: "A word" }).click();
  await page.getByLabel("Word or phrase").fill("my word");
  await page.getByLabel("Meaning").fill("my meaning");
  await page.getByRole("button", { name: "Save in this browser" }).click();
  await page.getByRole("link", { name: "Done" }).click();
  await page.getByRole("link", { name: /my word my meaning/i }).click();
  await page.getByLabel("Meaning").fill("edited meaning");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("link", { name: "Memories" }).first().click();
  await expect(page.getByText("edited meaning")).toBeVisible();

  await page.getByText("Backup and browser data").click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export backup" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^kambradu-backup-\d{4}-\d{2}-\d{2}\.json$/);

  await page.getByRole("link", { name: /my word edited meaning/i }).click();
  await page.getByRole("button", { name: "Delete memory" }).click();
  await page.getByRole("button", { name: "Yes, delete" }).click();
  await expect(page.getByRole("heading", { name: "Memory deleted." })).toBeVisible();
});

test("malformed browser data is preserved for recovery", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kambradu-local-data-v2", "{not valid json"));
  await page.goto("/memories");
  await expect(page.getByRole("heading", { name: "Stored data needs attention." })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download unreadable data" }).click();
  await downloadPromise;
  expect(await page.evaluate(() => localStorage.getItem("kambradu-local-data-v2"))).toBe("{not valid json");
});

test("a validated backup can be restored and all data can be cleared", async ({ page }) => {
  const timestamp = "2026-08-02T04:00:00.000Z";
  const backup = {
    version: 2,
    memories: [{ id: "restored-note", kind: "note", title: "Restored note", detail: "A kept detail", context: "At home", createdAt: timestamp, updatedAt: timestamp }],
    reviews: [],
    activeSession: null,
    updatedAt: timestamp
  };
  await page.goto("/memories");
  await page.getByText("Backup and browser data").click();
  await page.locator('input[type="file"]').setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.getByText("Restored note")).toBeVisible();
  await page.getByRole("button", { name: "Clear all" }).click();
  await page.getByRole("button", { name: "Yes, clear all" }).click();
  await expect(page.getByRole("heading", { name: "No memories yet." })).toBeVisible();
});

test("quota failure keeps the learner's entry on screen", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("Quota exceeded", "QuotaExceededError"); };
  });
  await page.goto("/memories/new");
  await page.getByLabel("Short title").fill("Do not lose this");
  await page.getByLabel("What do you want to remember?").fill("The text must remain in the form.");
  await page.getByRole("button", { name: "Save in this browser" }).click();
  await expect(page.getByRole("alert")).toContainText("still on screen");
  await expect(page.getByLabel("Short title")).toHaveValue("Do not lose this");
});

test("advanced public routes are closed in the production server", async ({ page }) => {
  for (const route of ["/builder", "/contribute", "/steward", "/sign-in"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(404);
    await expect(page.getByRole("heading", { name: "This page is not available." })).toBeVisible();
  }
});

test("release status exposes the build fingerprint", async ({ request }) => {
  const response = await request.get("/status");
  expect(response.ok()).toBeTruthy();
  const status = await response.json();
  expect(status.release).toMatch(/^[a-f0-9]{40}$/);
  expect(status.boundary).toBe("Kristang-only, web-only, text-only, local-first");
  expect(response.headers()["x-kambradu-release"]).toBe(status.release);
});

test("core screens reflow with large controls across target widths", async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 960, height: 900 },
    { width: 1440, height: 900 }
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/learn");
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1s: document.querySelectorAll("main h1").length,
      smallTargets: [...document.querySelectorAll<HTMLElement>("main button, main a[href]")]
        .filter((element) => element.getClientRects().length && (element.getBoundingClientRect().height < 44 || element.getBoundingClientRect().width < 44))
        .map((element) => element.textContent?.trim())
    }));
    expect(metrics.overflow, `${viewport.width}px overflow`).toBeLessThanOrEqual(0);
    expect(metrics.h1s, `${viewport.width}px H1 count`).toBe(1);
    expect(metrics.smallTargets, `${viewport.width}px small targets`).toEqual([]);
  }
});

test("keyboard focus and Kristang language markup are present", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.locator('[lang="mcm"]')).toHaveCount(6);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toContain("—");
});

test("desktop and mobile release screenshots can be captured", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.screenshot({ path: "output/playwright/public-prototype-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn");
  await page.screenshot({ path: "output/playwright/public-prototype-mobile.png", fullPage: true });
});
