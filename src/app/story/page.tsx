import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Headword, stressHint } from "@/components/ui/Headword";
import { defaultLanguage } from "@/data/languages";
import { LANGUAGE_TAG } from "@/lib/language";

/**
 * Why Kambradu exists, for someone deciding whether to try it.
 *
 * The page keeps to the public copy contract: one H1, short paragraphs, one
 * primary action at the end, and no claim the app cannot back. The one word
 * shown is read from the lexicon so its stress mark is the printed one.
 */
export default function StoryPage() {
  const friend = defaultLanguage.entries.find((entry) => entry.id === "kambradu");

  return (
    <AppShell activePath="/story">
      <div className="page story-page">
        <header className="page-heading">
          <h1>Who could I say it to?</h1>
          <p>Kambradu began with a Kristang greeting found in Melaka in 2013 and nobody to say it to.</p>
        </header>

        <section className="story-section">
          <h2>A language with about a thousand speakers</h2>
          <p>Kristang is the Portuguese and Malay creole of Melaka. It is spoken far more than it is written, and most of its speakers are older.</p>
          <p>There are few books, films or songs to learn from, and no agreed way to spell it.</p>
        </section>

        {friend ? (
          <section className="story-section">
            <h2>One word at a time</h2>
            <p className="story-word">
              <strong>
                <Headword form={friend.headword} stress={friend.stress} lang={LANGUAGE_TAG} />
              </strong>
              <span>{friend.glosses.join(", ")}</span>
              {stressHint(friend.headword, friend.stress) ? <small>{stressHint(friend.headword, friend.stress)}</small> : null}
            </p>
            <p>Kambradu gives you one word, checks you remember it, asks you to say it aloud and then asks where it fits in your life. What matters to you is kept, in your own browser.</p>
            <p>Every word is copied from the Baxter and de Silva dictionary with its page number, and the stress mark is the one printed there. Nothing is made up by analogy with Portuguese.</p>
          </section>
        ) : null}

        <section className="story-section">
          <h2>What it does not do</h2>
          <p>There are no streaks, points, accounts or reminders. Missing a week costs nothing.</p>
          <p>Nothing you write or record leaves your browser unless you export it yourself.</p>
        </section>

        <section className="story-section">
          <h2>Spelling is not a test</h2>
          <p>Kristang has no written standard that every community accepts, and how you spell a word is often part of where you are from. Where a word has more than one attested form, Kambradu shows them together and calls none of them the right one.</p>
        </section>

        <section className="story-section">
          <h2>Where it goes next</h2>
          <p>Speaker audio and teaching material need a named community relationship, and Kambradu waits for one rather than guessing. The longer aim is the same tools for other Malaysian languages with few speakers and fewer resources.</p>
        </section>

        <div className="story-actions">
          <Link className="primary-action" href="/">
            Start
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
          <Link className="quiet-link" href="/about">Sources and permissions</Link>
        </div>
      </div>
    </AppShell>
  );
}
