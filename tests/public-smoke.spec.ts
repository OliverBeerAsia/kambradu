import { expect, test } from "@playwright/test";

test("public homepage offers one gentle next step", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Ready for some Kristang?" })).toBeVisible();
  await expect(page.getByText(/meet a word and see where it takes you/i)).toBeVisible();
  await expect(page.getByRole("link", { name: "Let's begin" })).toBeVisible();
  await expect(page.getByText(/Saved on this device/i)).toBeVisible();
});

test("lexicon search filters by English gloss", async ({ page }) => {
  await page.goto("/lexicon");

  await page.getByPlaceholder("Search Kristang or English").fill("window");

  await expect(page.getByRole("option", { name: /janela/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "janela" })).toBeVisible();
});

test("learn offers a short choice of traced words", async ({ page }) => {
  await page.goto("/lessons");

  await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Meet sabang" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Home objects" })).toBeVisible();
  await expect(page.getByText(/reviewed community audio is not yet available/i)).toBeVisible();
});

test("auth-gated pages redirect to sign in", async ({ page }) => {
  await page.goto("/contribute");

  await expect(page).toHaveURL(/\/sign-in\?next=%2Fcontribute/);
  await expect(page.getByRole("heading", { name: /Shared work is not available yet/i })).toBeVisible();
});

test("learning plan toggles a local practice task", async ({ page }) => {
  await page.goto("/lessons");
  await page.getByRole("button", { name: /Start practice/i }).first().click();
  await expect(page).toHaveURL(/\/practice/);
  await expect(page.getByRole("heading", { name: "Meet sabang." })).toBeVisible();
});

test("practice session saves one gentle local learning moment", async ({ page }) => {
  await page.goto("/practice");

  await expect(page.getByRole("heading", { name: "Meet sabang." })).toBeVisible();
  await expect(page.getByText(/No reviewed audio is available/i)).toBeVisible();
  await expect(page.getByLabel("Speaker name")).toHaveCount(0);

  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Try sabang." })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "With someone I know" }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Keep this on your device?" })).toBeVisible();
  await page.getByRole("button", { name: "Save on this device" }).click();

  await expect(page.getByRole("heading", { name: "Practice complete." })).toBeVisible();
  await expect(page.getByText(/Other people using this browser profile/i)).toBeVisible();
});

test("memories combines private records and saves a gentle capture", async ({ page }) => {
  await page.goto("/saved");

  await expect(page.getByRole("heading", { name: "My memories" })).toBeVisible();
  await expect(page.getByText("Recently kept")).toBeVisible();
  await expect(page.getByText("sabang", { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "Add a memory" }).first().click();
  await page.getByRole("button", { name: /Something someone said/i }).click();
  await page.getByRole("textbox", { name: "What did you hear?" }).fill("A family saying I want to remember.");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("textbox", { name: "Where did you hear or encounter it?" }).fill("A quiet conversation at home.");
  await page.getByRole("button", { name: "Save on this device" }).click();

  await expect(page.getByRole("heading", { name: "Saved on this device" })).toBeVisible();
  await page.getByRole("link", { name: "Done" }).click();
  await expect(page.getByText("A family saying I want to remember.")).toBeVisible();
});

test("lexicon builder saves a private local entry", async ({ page }) => {
  await page.goto("/builder");

  await page.getByLabel("Kristang word or phrase").fill("testu");
  await page.getByLabel("Meaning in English").fill("test word");
  await page.getByLabel("Where this came from").fill("Local smoke test note with source context.");
  await page.getByRole("button", { name: "Save on this device" }).click();

  await expect(page.getByRole("heading", { name: "testu" })).toBeVisible();
  await expect(page.getByText(/Other people using this browser profile/i)).toBeVisible();
});

test("contribution form requires provenance and consent", async ({ page }) => {
  await page.goto("/sign-in?next=/contribute");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/contribute/);

  await page.getByLabel("Title or headword").fill("");
  await page.getByLabel("Provenance").fill("");
  await page.getByLabel("Permission notes").fill("");
  await page.getByRole("button", { name: "Keep draft for future review" }).click();

  await expect(page.getByText("Title, content, provenance, and consent are required")).toBeVisible();
});

test("local review never leaks an unverified entry into Explore", async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto("/sign-in?next=/lessons");
  await page.getByRole("button", { name: "Continue as local demo user" }).click();
  await expect(page).toHaveURL(/\/lessons/);

  await page.getByRole("button", { name: "Start practice" }).first().click();

  await page.goto("/practice");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "With someone I know" }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Save on this device" }).click();
  await expect(page.getByText(/Saved on this device/i)).toBeVisible();

  await page.getByRole("button", { name: "Save a question" }).click();
  await page.getByRole("button", { name: "Keep this question" }).click();
  await expect(page.getByText(/Question saved on this device/i)).toBeVisible();

  await page.goto("/builder");
  await page.getByLabel("Kristang word or phrase").fill("sabang local");
  await page.getByLabel("Meaning in English").fill("learner note");
  await page.getByLabel("Your example or context").fill("A personal context note.");
  await page.getByLabel("Where this came from").fill("Unverified learner note from this device.");
  await page.getByRole("button", { name: "Save on this device" }).click();
  await expect(page.getByRole("heading", { name: "sabang local" })).toBeVisible();

  await page.goto("/contribute");
  await expect(page.getByText(/practice reviews/i)).toBeVisible();
  await page.getByLabel("Title or headword").fill("sabang local");
  await page.getByLabel("English gloss").fill("learner note");
  await page.getByRole("button", { name: "Keep draft for future review" }).click();
  await expect(page.getByText(/has not been published/i)).toBeVisible();

  await page.goto("/steward");
  await page.getByRole("button", { name: /sabang local/i }).click();
  await page.getByRole("button", { name: "Request changes" }).click();
  await expect(page.getByText("Feedback sent to the learner cycle.")).toBeVisible();

  await page.getByRole("button", { name: "Mark locally checked" }).click();
  await expect(page.getByText(/It has not been published/i)).toBeVisible();

  await page.goto("/lexicon");
  await page.getByPlaceholder("Search Kristang or English").fill("sabang local");
  await expect(page.getByRole("heading", { name: "No matching entries" })).toBeVisible();
});

test("mobile drawer exposes protected routes and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open navigation drawer" }).click();
  const drawer = page.getByRole("dialog", { name: "Kambradu navigation" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Memories" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();

  const quickNavigation = page.getByRole("navigation", { name: "Quick navigation" });
  await expect(quickNavigation).toBeVisible();
  await expect(quickNavigation.getByRole("link", { name: "Learn" })).toBeVisible();
  await expect(quickNavigation.getByRole("link", { name: "Explore" })).toBeVisible();
});
