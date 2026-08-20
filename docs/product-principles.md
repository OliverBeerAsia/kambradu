# Product principles

This is the public product and copy contract for Kambradu.

## The learner outcome

Learn something useful. Connect it to a person, place or memory. Keep what matters.

Kambradu is Kristang-only, web-only and local-first for this milestone. Public language content is text only. A learner may record their own voice privately; no other person's voice is recorded, and nothing is scored.

## Three places

The global learner navigation contains exactly:

1. Today
2. Learn
3. Memories

About, sources and permissions stay in the footer or secondary menu. Reference words sit inside Learn. No dashboard, feed, score, streak or activity centre is needed.

## One action at a time

Each learner screen has one job, one H1, one short supporting sentence and one large primary action. At most one quiet secondary action may appear.

The text learning rhythm is:

`Meet -> Meaning -> Recall -> Try -> Connect -> Keep`

Today shows one of three useful states: start a new word, continue the current word, or complete one due review.

## Interaction guidance

Kambradu borrows Duolingo's useful exercise rhythm: a single prompt, a clear response, immediate feedback and an obvious next action. It does not borrow streaks, points, lives, leaderboards, currencies, loss warnings or childish tone. See Duolingo's notes on its [linear home redesign](https://blog.duolingo.com/new-duolingo-home-screen-design/) and [shorter learning units](https://blog.duolingo.com/intermediate-mini-units/).

Kambradu borrows Basecamp's focus on the page's essential action, contextual disclosure and copy as interface design. Utilities, evidence and recovery controls remain available without competing with the current task. See Basecamp's guidance on [epicentre design](https://basecamp.com/gettingreal/09.2-epicenter-design), [copywriting as interface design](https://basecamp.com/gettingreal/09.7-copywriting-is-interface-design) and [blank and error states](https://basecamp.com/gettingreal/09.3-three-state-solution).

These references guide interaction strategy. Kambradu keeps its own adult, quiet visual and verbal character.

## Copy limits

- H1: two to seven words where the language item does not require more.
- Supporting sentence: no more than 20 words.
- Today: no more than 35 explanatory words before the main action.
- Practice instruction: no more than 15 words.
- Feedback: no more than 12 words where possible.
- Button label: normally one to four words.
- No explanatory paragraph longer than two sentences.

Remove any line that repeats the heading, control label or previous sentence. Use literal verbs. Do not use learner-facing terms such as cycle, ledger, packet, provenance or steward.

Public copy must be warm, adult, plain and specific. Reject filler, canned praise, inflated claims, rescue language, process language, unsupported approval claims, repetition and em dashes.

### No machine filler

Copy that reads as though a language model wrote it does not ship, however true it is. Write the sentence a person would say out loud.

Banned outright, and enforced by `tests/public-smoke.spec.ts`: em dashes; emoji; and the words and constructions *delve, seamless, unlock, empower, elevate, robust, leverage, harness, cutting-edge, revolutionise, supercharge, game-changer, dive in, in today's, it's important to note, furthermore, moreover, additionally, transform your, take your, look no further, whether you're, we've got you, rest assured, effortless, unleash, embark, tapestry, testament to, navigate the, realm of, at the end of the day*.

Also reject, by reading rather than by test: the "not just X, but Y" pivot, three-item lists used for rhythm rather than meaning, a closing sentence that restates the paragraph, and any sentence that would survive being deleted.

## Visual and control rules

- One calm reading column.
- One filled action colour.
- Primary controls are at least 56 pixels high.
- Other interactive targets are at least 44 by 44 pixels.
- Body and input text is 18 pixels where space permits, with comfortable line spacing.
- Mobile primary actions use the available width.
- Borders are light, shadows are rare and nested card stacks are avoided.
- One H1 per screen. Headings go no deeper than H3 and never skip a level.
- Two headings never sit together with nothing between them. If a heading has no content of its own, it is not a heading.
- A heading earns its place by naming a section a learner would look for. Sections that exist only to hold one sentence are dissolved into the text.
- Body text is at least 16 pixels with line spacing of at least 1.35, at a contrast of at least 4.5:1, and no more than about 78 characters per line.
- Focus is clearly visible.
- No autoplay, confetti, bouncing controls or pressure animation.
- Reduced-motion settings disable non-essential animation.

## Brand

The brand is the terracotta `K` wordmark, the warm paper background and one filled action colour. It is applied the same way on every screen; there is no second style for secondary pages.

- The wordmark appears exactly once per screen, in the shell header. It is never redrawn, recoloured, rotated or set in another typeface.
- `--action` is the only filled action colour. `--success` and `--danger` report state and are never used for decoration.
- No colour outside the tokens in `globals.css` reaches the screen. Native control chrome counts: an unreset `<progress>`, checkbox or slider paints in the browser's own palette, so every native control is restyled or reset.
- Icons are line icons at the sizes already in use. No illustration, badge, sticker, gradient or drop shadow beyond `--shadow`.
- Type comes from the scale tokens `--text-sm` to `--text-xl` and the heading clamps. `--text-sm` (16px) is the floor: no text a learner reads is smaller, on any screen, in any state.

## Hegel

Hegel may appear on Today and completion only. Hegel is optional and quiet. Hegel never supplies Kristang, cultural guidance, pronunciation or approval.

## Competing forms

Most languages Kambradu serves have no agreed spelling. Where a word has more than one
attested form, the forms appear together and none is presented as the one to use.

- Say what kind of difference it is. "Also written X" for a different spelling of the same
  sound; "Also said X" for a form that sounds different.
- Where forms compete, say so plainly: "No form here is more correct than another."
- Never write correct, proper, standard, official, wrong, incorrect or misspelling about a
  learner's language, in the interface or in the data.
- A word with no recorded variation says nothing about variation. Silence is not a claim.
- Show the source tradition, not a ruling. The learner decides what to write.

## Evidence language

Public language content uses these independent fields:

- `source_transcribed`
- `source_checked`
- `speaker_attested`
- `partner_reviewed`
- `public_use_allowed`

The interface translates `source_checked` as “Checked against the dictionary.” It never translates that field into “approved.”

All Kristang text uses `lang="mcm"`.

## Cultural boundary

Kambradu is infrastructure, not a cultural authority. It does not claim that technology can save a language. Community naming, access, review, teaching and publication rules require direct guidance from the people concerned.

No new teaching item is added until a named reviewer can verify contemporary use, preferred form and lesson suitability.

## Human review gate

Before any public change:

1. Read every screen aloud.
2. Remove repeated meaning.
3. Confirm the next action is obvious.
4. Confirm each claim has evidence.
5. Confirm the copy stays within the budgets above.
6. Complete keyboard and small-screen checks.
7. Look at the rendered screen, not only the markup. Native controls and brand colour cannot be checked by reading code.
