import { expect, test, type Page } from "@playwright/test";

async function completeSabang(page: Page, keep = true) {
  await page.goto("/practice?lesson=shop-visit");
  await expect(page.getByRole("heading", { name: "sabang" })).toBeVisible();
  await expect(page.getByText(/pronounce|pronunciation/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "soap", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("It means soap");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Your answer").fill("sabang");
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("status")).toContainText("matches the dictionary form");
  await page.getByRole("button", { name: "Got it" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  // Try: saying the word aloud is optional and skippable, and nothing is scored.
  await expect(page.getByRole("heading", { name: /Say sabang out loud/ })).toBeVisible();
  await expect(page.getByText(/accuracy|score|correct pronunciation/i)).toHaveCount(0);
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

test("Learn offers only source-checked text words", async ({ page }) => {
  await page.goto("/learn/kristang");
  await expect(page.getByRole("heading", { name: "Learn a word." })).toBeVisible();
  await expect(page.getByRole("link", { name: /^sabang/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^janela/ })).toBeVisible();
  // The boundary is the evidence claim, not the number of words.
  // No reviewed community audio. The learner's own private recording is a different thing.
  await expect(page.locator("audio:not(.own-recording)")).toHaveCount(0);
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/\bapproved\b/i);
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
  await expect(page.locator('p.error-notice[role="alert"]')).toContainText("still on screen");
  await expect(page.getByLabel("Short title")).toHaveValue("Do not lose this");
});

test("the contributor and steward screens are not in the build at all", async ({ page }) => {
  // The site ships as static files, so there is no server to gate a route on.
  // A page that should not be public therefore has to be absent, not hidden.
  for (const route of ["/builder", "/contribute", "/steward", "/sign-in"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(404);
  }
});

test("release status exposes the build fingerprint", async ({ request }) => {
  const response = await request.get("/status");
  expect(response.ok()).toBeTruthy();
  const status = await response.json();
  expect(status.release).toMatch(/^[a-f0-9]{40}$/);
  // The boundary is a claim about the product, so it has to stay true of it.
  expect(status.boundary).toBe("web-only, local-first, no accounts, no uploads");
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
  await page.goto("/learn/kristang");
  // Every Kristang headword on the page carries the language tag.
  const headwords = page.locator(".word-list strong");
  const tagged = page.locator('.word-list strong[lang="mcm"]');
  await expect(tagged).toHaveCount(await headwords.count());
  await expect(headwords.first()).toBeVisible();
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

test("the printed stress mark is shown, and never invented", async ({ page }) => {
  await page.goto("/practice?lesson=sabang");
  // sabang is underlined on bang in the printed dictionary.
  await expect(page.locator("h1 .stressed-syllable")).toHaveText("bang");
  await expect(page.getByText("Say it with the weight on bang.")).toBeVisible();

  // sol is a monosyllable and carries no mark in the source, so none is shown.
  await page.goto("/practice?lesson=sol");
  await expect(page.getByRole("heading", { name: "sol" })).toBeVisible();
  await expect(page.locator("h1 .stressed-syllable")).toHaveCount(0);
  await expect(page.getByText(/weight on/)).toHaveCount(0);
});

/** Learner-facing screens. Dev-only routes are closed in production. */
const LEARNER_ROUTES = ["/", "/learn", "/learn/kristang", "/learn/malay", "/memories", "/about", "/story", "/practice?lesson=sabang"];

test("learner copy stays plain and free of generated filler", async ({ page }) => {
  // Machine-written padding, marketing inflation and typographic tells.
  const banned = [
    "—", "delve", "seamless", "unlock", "empower", "elevate", "robust",
    "leverage", "harness", "cutting-edge", "revolution", "supercharge",
    "game-chang", "dive in", "in today's", "it's important to note",
    "furthermore", "moreover", "additionally", "transform your",
    "take your", "look no further", "whether you're", "we've got you",
    "rest assured", "effortless", "unleash", "embark", "tapestry",
    "testament to", "navigate the", "realm of", "at the end of the day",
    // process vocabulary the contract already forbids in front of a learner
    "cycle", "ledger", "packet", "provenance", "steward", "approved"
  ];
  for (const route of LEARNER_ROUTES) {
    await page.goto(route);
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const phrase of banned) {
      expect(text, `${route} contains "${phrase}"`).not.toContain(phrase.toLowerCase());
    }
    // No emoji: the character is quiet and adult.
    expect(text, `${route} contains an emoji`).not.toMatch(/\p{Extended_Pictographic}/u);
  }
});

test("headings stay shallow and never stack", async ({ page }) => {
  for (const route of LEARNER_ROUTES) {
    await page.goto(route);
    const result = await page.evaluate(() => {
      const headings = [...document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main h4, main h5, main h6")]
        .filter((element) => element.getClientRects().length);
      const levels = headings.map((element) => Number(element.tagName[1]));
      // A heading whose next visible content is another heading is a stack.
      const stacked = headings
        .filter((element, index) => {
          const next = headings[index + 1];
          if (!next) return false;
          const between = element.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING;
          if (!between) return false;
          const range = document.createRange();
          range.setStartAfter(element);
          range.setEndBefore(next);
          return range.toString().trim() === "";
        })
        .map((element) => element.textContent?.trim());
      // No level may be skipped on the way down.
      const skipped: string[] = [];
      let previous = 1;
      for (const [index, level] of levels.entries()) {
        if (level > previous + 1) skipped.push(headings[index].textContent?.trim() ?? "");
        previous = level;
      }
      return { levels, stacked, skipped, deepest: Math.max(1, ...levels) };
    });
    expect(result.stacked, `${route} stacks headings`).toEqual([]);
    expect(result.skipped, `${route} skips a heading level`).toEqual([]);
    expect(result.deepest, `${route} nests headings too deeply`).toBeLessThanOrEqual(3);
  }
});

test("body text is large enough, spaced enough and high enough contrast", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of LEARNER_ROUTES) {
    await page.goto(route);
    const problems = await page.evaluate(() => {
      function channel(value: number) {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      }
      function luminance(rgb: number[]) {
        return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
      }
      function parse(colour: string) {
        const match = colour.match(/\d+(\.\d+)?/g);
        return match ? match.slice(0, 3).map(Number) : null;
      }
      function backgroundOf(element: Element): number[] {
        let node: Element | null = element;
        while (node) {
          const value = getComputedStyle(node).backgroundColor;
          const rgb = parse(value);
          const alpha = value.match(/rgba?\([^)]*,\s*([\d.]+)\)/);
          if (rgb && (!alpha || Number(alpha[1]) > 0.9)) return rgb;
          node = node.parentElement;
        }
        return [255, 255, 255];
      }
      const issues: string[] = [];
      const nodes = [...document.querySelectorAll<HTMLElement>("main p, main li, main dd, main dt, main label, main small")];
      for (const node of nodes) {
        if (!node.getClientRects().length || !node.textContent?.trim()) continue;
        const style = getComputedStyle(node);
        const size = parseFloat(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight) / size;
        const text = node.textContent.trim().slice(0, 30);
        if (size < 16) issues.push(`${text}: ${size}px`);
        if (Number.isFinite(lineHeight) && lineHeight < 1.35) issues.push(`${text}: line-height ${lineHeight.toFixed(2)}`);
        const fg = parse(style.color);
        if (!fg) continue;
        const bg = backgroundOf(node);
        const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
        const ratio = (a + 0.05) / (b + 0.05);
        if (ratio < 4.5) issues.push(`${text}: contrast ${ratio.toFixed(2)}:1`);
        if (node.getBoundingClientRect().width / size > 78) issues.push(`${text}: line too long`);
      }
      return issues;
    });
    expect(problems, `${route} readability`).toEqual([]);
  }
});

test("brand assets are used consistently and Hegel stays in his two places", async ({ page }) => {
  // One wordmark per screen, and the icons the manifestless shell points at exist.
  for (const route of LEARNER_ROUTES) {
    await page.goto(route);
    await expect(page.locator(".brand-mark"), `${route} wordmark`).toHaveCount(1);
  }
  for (const asset of ["/icon.svg", "/apple-touch-icon.png", "/icon-512.png"]) {
    const response = await page.request.get(asset);
    expect(response.status(), `${asset} missing`).toBe(200);
  }
  // Native control chrome paints outside the palette unless it is reset.
  await page.goto("/practice?lesson=sabang");
  const nativeAppearance = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("main progress, main input[type=range]")]
      .filter((element) => getComputedStyle(element).appearance !== "none")
      .map((element) => element.tagName.toLowerCase())
  );
  expect(nativeAppearance, "native control chrome is unstyled").toEqual([]);

  // Hegel belongs on Today and on completion, nowhere else.
  await page.goto("/learn");
  await expect(page.locator(".hegel-companion")).toHaveCount(0);
  await page.goto("/memories");
  await expect(page.locator(".hegel-companion")).toHaveCount(0);
  await page.goto("/");
  await expect(page.locator(".hegel-companion")).toHaveCount(1);
});

test("competing forms sit beside each other and none is ranked", async ({ page }) => {
  // porta and potra both occur in the source and differ in sound, not spelling.
  await page.goto("/practice?lesson=porta");
  const note = page.locator(".variant-note");
  await expect(note).toContainText("Also said");
  await expect(note.locator('[lang="mcm"]')).toHaveText("potra");
  await expect(note).toContainText("No form here is more correct than another.");
  // The interface must never rank one form above the other.
  const body = (await page.locator("body").innerText()).toLowerCase();
  for (const claim of ["correct spelling", "proper spelling", "standard spelling", "misspell", "incorrect"]) {
    expect(body, `porta page claims "${claim}"`).not.toContain(claim);
  }

  // A word with no recorded variation says nothing at all.
  await page.goto("/practice?lesson=sabang");
  await expect(page.locator(".variant-note")).toHaveCount(0);
});
