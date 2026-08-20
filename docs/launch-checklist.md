# Public prototype launch checklist

## 1. Establish live truth

- Record the current `kambradu.web.app` route map.
- Capture desktop and mobile screenshots.
- Capture response headers and `/status` if present.
- Identify the exact deployed commit or record that it is unknown.
- Confirm the rollback release and tag.

## 2. Freeze an exact candidate

- Review the working tree and preserve unrelated changes.
- Commit the intended paths.
- Record the commit SHA and build date.
- Confirm both demo-auth flags are unset or false.
- Run `npm ci` from the committed lockfile.
- Confirm Next.js is at or above the current patched 15.x security release.
- Run a current production dependency audit.

## 3. Verify locally

- `npm run type-check`
- `npm run test:unit`
- `npm run build`
- `npm run test:smoke`
- Confirm the smoke suite uses `next start`.
- Confirm a fresh browser has zero memories.
- Complete save and no-save learning paths.
- Reload at each practice step.
- Test edit, practise, delete, export, restore and clear all.
- Test malformed storage and quota failure.
- Confirm advanced routes return 404 in production.
- Confirm `/status` matches the candidate commit.

## 4. Accessibility and responsive checks

- One H1 per learner screen.
- Navigation is exactly Today, Learn and Memories.
- Complete the loop by keyboard.
- Complete a VoiceOver and Safari pass.
- Run automated accessibility scanning with no serious or critical findings.
- Check 320, 390, 820, 960 and 1440 pixel widths.
- Check a short mobile height and landscape.
- Check 200 percent zoom and text spacing.
- Check reduced motion.
- Confirm no horizontal scrolling or obscured focus.

## 5. Content and copy review

- Only `sabang` and `janela` are public.
- Every Kristang item uses `lang="mcm"`.
- No pronunciation teaching, respelling, accent scoring or speaker recording appears.
- The optional Try step records only the learner's own voice, keeps it in their browser, and never scores or compares it.
- Evidence says “Checked against the dictionary,” not “approved.”
- No community endorsement, rescue or save-a-language claim appears.
- Copy meets [product-principles.md](product-principles.md).

## 6. Preview and promotion

- Deploy a Firebase preview from the exact candidate commit.
- Verify the preview route map, screenshots, headers and release ID.
- Run synthetic checks against Today, Learn, Memories, About and closed routes.
- Promote the same verified artifact.
- Do not rebuild between preview and production.

## 7. Live verification and rollback

- Confirm the live release ID matches the candidate SHA.
- Repeat core learning and memory smoke checks.
- Confirm advanced routes remain closed.
- Preserve the previous Firebase release and Git tag.
- Roll back immediately if release identity, storage recovery or route closure differs from the verified preview.
