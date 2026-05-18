import { expect, test } from "@playwright/test";

test("public homepage loads the dashboard shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Saved words" })).toBeVisible();
});

test("lexicon search filters by English gloss", async ({ page }) => {
  await page.goto("/lexicon");

  await page.getByPlaceholder("Search Kristang or English").fill("window");

  await expect(page.getByRole("option", { name: /janela/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "janela" })).toBeVisible();
});

test("lessons catalog exposes roadmap resource units", async ({ page }) => {
  await page.goto("/lessons");

  await expect(page.getByRole("heading", { name: "Browse" })).toBeVisible();
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

  await expect(page.getByRole("heading", { name: "Practice", exact: true })).toBeVisible();
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
  await expect(page.getByText("Entry saved privately and attached to the active cycle.")).toBeVisible();
});

test("contribution form requires provenance and consent", async ({ page }) => {
  await page.goto("/sign-in?next=/contribute");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/contribute/);

  await page.getByLabel("Title or headword").fill("");
  await page.getByLabel("Provenance").fill("");
  await page.getByLabel("Consent and attribution").fill("");
  await page.getByRole("button", { name: "Submit for steward review" }).click();

  await expect(page.getByText("Title, content, provenance, and consent are required")).toBeVisible();
});

test("local learning cycle reaches steward approval and public browse", async ({ page }) => {
  await page.goto("/sign-in?next=/lessons");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/lessons/);

  await page.getByRole("button", { name: "Resume cycle" }).first().click();

  await page.goto("/practice");
  await page.getByRole("button", { name: "Show text" }).click();
  await page.getByLabel("Private use note").fill("The shop phrase fits a morning errand with family.");
  await page.getByRole("button", { name: "Save review locally" }).click();
  await expect(page.getByText(/Saved on this device/i)).toBeVisible();

  await page.getByLabel("Speaker name").fill("Aunty");
  await page.getByLabel("Relationship").fill("family speaker");
  await page.getByLabel("Consent status").selectOption("community-review");
  await page.getByRole("button", { name: "Save speaker check" }).click();
  await expect(page.getByText(/Speaker check saved as review-ready/i)).toBeVisible();

  await page.goto("/journal");
  await page.getByLabel("Title").fill("Shop phrase note");
  await page.getByLabel("Journal entry").fill("Use this phrase when buying soap or snacks at a family shop.");
  await page.getByRole("button", { name: "Save private note" }).click();
  await expect(page.getByText("Private note attached to the active cycle.")).toBeVisible();

  await page.goto("/builder");
  await page.getByLabel("Headword").fill("sabang local");
  await page.getByLabel("English gloss").fill("soap from local shop note");
  await page.getByLabel("Example sentence or context").fill("Nha mae bai loja kompra sabang.");
  await page.getByLabel("Source note").fill("Private learner note plus speaker check from the Shop visit cycle.");
  await page.getByRole("button", { name: "Add to my lexicon" }).click();
  await expect(page.getByRole("heading", { name: "sabang local" })).toBeVisible();

  await page.goto("/contribute");
  await expect(page.getByText(/practice reviews/i)).toBeVisible();
  await page.getByLabel("Title or headword").fill("sabang local");
  await page.getByLabel("English gloss").fill("soap from local shop note");
  await page.getByRole("button", { name: "Submit for steward review" }).click();
  await expect(page.getByText("Draft is queued locally as submitted and attached to the active learning cycle.")).toBeVisible();

  await page.goto("/steward");
  await page.getByRole("button", { name: /sabang local/i }).click();
  await page.getByRole("button", { name: "Request changes" }).click();
  await expect(page.getByText("Feedback sent to the learner cycle.")).toBeVisible();

  await page.goto("/builder");
  await page.getByLabel("Headword").fill("sabang local revision");
  await page.getByLabel("English gloss").fill("soap with clearer source note");
  await page.getByLabel("Source note").fill("Revision after steward feedback with source and consent detail clarified.");
  await page.getByRole("button", { name: "Add to my lexicon" }).click();

  await page.goto("/steward");
  await page.getByRole("button", { name: /sabang local/i }).click();
  await page.getByRole("button", { name: "Approve and publish" }).click();
  await expect(page.getByText("Cycle approved locally and exposed to public browse.")).toBeVisible();

  await page.goto("/lexicon");
  await page.getByPlaceholder("Search Kristang or English").fill("sabang local");
  await expect(page.getByRole("heading", { name: "sabang local" })).toBeVisible();
});

test("mobile drawer exposes protected routes and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation drawer" }).click();
  const drawer = page.getByRole("dialog", { name: "Kambradu navigation" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Build" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});
