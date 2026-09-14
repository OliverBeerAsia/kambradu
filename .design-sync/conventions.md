## Building with Kambradu

Kambradu is a learner's site for Kristang, an endangered creole. Every screen is one calm reading column on warm paper, with one filled action colour. There is no provider or theme wrapper: link `styles.css` and the tokens, fonts and component styles are all there.

### Layout

Wrap a screen in `AppShell` (`activePath` is one of `/`, `/learn`, `/memories`; `immersive` for practice). Inside it, use these classes from `styles.css` for the page itself:

- `.page` for the column (max width `--content`), `.page-heading` for the H1 plus one supporting `<p>`.
- Cards: `.today-card`, `.practice-card`, `.lesson-card`, `.empty-state`. Light `--line` borders; only Today and Practice carry `--shadow`.
- Lists: `.word-list` (grid of `<a>` tiles with `<strong>` and `<small>`), `.memory-list` with `.memory-link`.
- Controls: `.primary-action` (the only filled button, `--action`, min 56px), `.secondary-action`, `.quiet-action`. Choice grids: `.answer-grid`, `.context-choices`, `.confidence-choices` with `aria-pressed`.
- Notices: `.plain-feedback`, `.save-notice`, `.error-notice`. Disclosures: `<details class="source-note">` or `.dictionary-reference`.

### Tokens

Colours: `--page`, `--surface`, `--surface-warm`, `--ink`, `--muted`, `--line`, `--line-strong`, `--action`, `--action-hover`, `--action-soft`, `--success`, `--success-soft`, `--danger`, `--danger-soft`, `--focus`. Type: `--text-sm` (16px, the floor), `--text-base` (18px body), `--text-lg`, `--text-xl`. Shape: `--radius`, `--shadow`, `--content`, `--reading`. Use no colour outside these.

### Type

`h1` and `h2` are Montserrat 900; everything else is Inter. Keep the H1 to two to seven words and one per screen. Headings never nest deeper than H3 and never sit directly on another heading.

### Language

Kristang text always carries `lang="mcm"`. Show a word with `Headword` (it draws the stressed syllable the way the dictionary underlines it; pass `stress` only when the source marks it). Show other attested forms with `VariantNote`; never call a form correct, standard, proper or wrong. Hegel (`HegelCompanion`) appears on Today and completion only, with `portraitSrc={window.Kambradu.hegelPortrait}`.

### Never

No streaks, points, badges, confetti, gradients, emoji, illustration beyond Hegel, or a second filled colour. Copy is warm, adult and plain: no em dashes, no filler.

### One screen

```jsx
const { AppShell, HegelCompanion, hegelPortrait } = window.Kambradu;

<AppShell activePath="/">
  <div className="page today-page">
    <section className="today-card">
      <HegelCompanion portraitSrc={hegelPortrait}>
        <h1>Learn your first Kristang word.</h1>
        <p>One word, one quick check and a place to keep it.</p>
      </HegelCompanion>
      <a className="primary-action" href="/practice">Start</a>
    </section>
  </div>
</AppShell>
```
