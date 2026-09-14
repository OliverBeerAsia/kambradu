# Design sync notes

Repo-specific facts a re-sync needs. Config lives in `config.json` beside this file.

- Kambradu is a Next.js app, not a library: there is no `dist/`. The converter synthesises its entry from `src/components` (`srcDir`), so run it with `--entry ./dist/index.js` (a path that does not exist) purely to anchor the package root; without `--entry` it looks for `node_modules/kambradu` and fails.
- Only the five reusable pieces are synced (`componentSrcMap`); the page-level screens are excluded with `null` because they read browser storage.
- `next/link` reads Next-only environment variables at load time and throws in a plain browser, which breaks the whole bundle. `.design-sync/tsconfig.json` aliases it to `.design-sync/shims/next-link.tsx`, a plain anchor. The converter's tsconfig reader cannot parse the root `tsconfig.json` (its comment stripper eats `"@/*"`), so `@/` imports are left to esbuild's own resolution and the design tsconfig carries only the shim alias.
- Fonts are served from `/fonts` at the site root, which the bundle cannot reach. `.design-sync/fonts.css` redeclares the two faces relative to `public/fonts`; the root-absolute rules from `globals.css` are dropped at build time.
- Hegel's portrait is served from `/hegel.png`. `.design-sync/shims/hegel-portrait.ts` merges a 224px data URI onto `window.Kambradu.hegelPortrait` (`extraEntries`), and `HegelCompanion` grew an optional `portraitSrc` prop for it. Regenerate the data URI if `public/hegel.png` changes: `sips -z 224 224 public/hegel.png`, then base64.
- The app loads its faces through next/font and refers to them as `var(--font-inter)` / `var(--font-montserrat)`. `.design-sync/fonts.css` defines both variables for the bundle; without them every card falls back to system fonts.
- Prop contracts are hand-written in `dtsPropsFor` because synth mode extracts none. Update them when a component's props change.
- `guidelinesGlob` is pinned to the two documents that describe design and content rules; the rest of `docs/` is engineering material.
- `AppShell` uses `cardMode: single` because its phone bottom bar is position: fixed and escapes a grid cell.

## Re-sync risks

- `dtsPropsFor` bodies and the portrait data URI are copies; they go stale silently if the source changes.
- `stressHint` and other non-component exports ride along on `window.Kambradu`; harmless, but the export count in validate is larger than the component count.
- Playwright for the render check is `.ds-sync/node_modules/playwright@1.60.0`, matching the repo's `@playwright/test` and the cached Chromium 1223. A repo bump needs the same bump in `.ds-sync`.
