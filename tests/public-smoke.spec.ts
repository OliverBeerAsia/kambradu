import { expect, test } from "@playwright/test";

test("public homepage loads the dashboard shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open Lexicon/i })).toBeVisible();
  await expect(page.getByText("Pending review")).toBeVisible();
});

test("lexicon search filters by English gloss", async ({ page }) => {
  await page.goto("/lexicon");

  await page.getByPlaceholder("Search Kristang or English").fill("window");

  await expect(page.getByRole("option", { name: /janela/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "janela" })).toBeVisible();
});

test("lessons catalog exposes roadmap resource units", async ({ page }) => {
  await page.goto("/lessons");

  await expect(page.getByRole("heading", { name: "Lessons and resources" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shop visit micro-lesson" })).toBeVisible();

  await page.getByRole("tab", { name: "story" }).click();

  await expect(page.getByRole("heading", { name: "Festa story seed" })).toBeVisible();
});

test("auth-gated pages redirect to sign in", async ({ page }) => {
  await page.goto("/builder");

  await expect(page).toHaveURL(/\/sign-in\?next=%2Fbuilder/);
  await expect(page.getByRole("heading", { name: /Sign in to save/i })).toBeVisible();
});

test("learning plan toggles a local practice task", async ({ page }) => {
  await page.goto("/sign-in?next=/learn");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/learn/);

  const task = page.getByRole("button", { name: /Listen to the shop phrase/i });
  await expect(task).toHaveAttribute("aria-pressed", "false");

  await task.click();

  await expect(task).toHaveAttribute("aria-pressed", "true");
});

test("practice session saves an audio-first local review", async ({ page }) => {
  await page.goto("/sign-in?next=/practice");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/practice/);

  await expect(page.getByRole("heading", { name: "Practice session" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Listen before reading" })).toBeVisible();

  await page.getByRole("button", { name: "Show text" }).click();
  await expect(page.getByRole("heading", { name: "loja" })).toBeVisible();

  await page.getByRole("button", { name: /Need this again/i }).click();
  await page.getByLabel("Private use note").fill("I would use this when talking about the morning shop run.");
  await page.getByRole("button", { name: "Save review locally" }).click();

  await expect(page.getByText(/Saved on this device/i)).toBeVisible();
});

test("lexicon builder saves a private local entry", async ({ page }) => {
  await page.goto("/sign-in?next=/builder");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/builder/);

  await page.getByLabel("Headword").fill("testu");
  await page.getByLabel("English gloss").fill("test word");
  await page.getByLabel("Source note").fill("Local smoke test note with private source context.");
  await page.getByRole("button", { name: "Add to my lexicon" }).click();

  await expect(page.getByRole("heading", { name: "testu" })).toBeVisible();
  await expect(page.getByText("Entry saved privately in this browser.")).toBeVisible();
});

test("contribution form requires provenance and consent", async ({ page }) => {
  await page.goto("/sign-in?next=/contribute");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/contribute/);

  await page.getByRole("button", { name: "Submit for steward review" }).click();

  await expect(page.getByText("Title, content, provenance, and consent are required")).toBeVisible();
});
