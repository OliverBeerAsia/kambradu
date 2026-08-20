import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Language } from "@/types/kambradu";

/**
 * The languages a learner can study.
 *
 * Kambradu exists for languages that lack speakers and resources, and it says
 * which is which rather than presenting every language as equally at risk. A
 * widely spoken language is offered as a way in, not as the point.
 */
export function LanguageChooser({ languages }: { languages: Language[] }) {
  return (
    <div className="page learn-page">
      <header className="page-heading">
        <h1>Choose a language.</h1>
        <p>Pick one to start. You can switch whenever you like.</p>
      </header>

      <ul className="word-list language-list">
        {languages.map((language) => (
          <li key={language.id}>
            <Link href={`/learn/${language.id}`}>
              <span>
                <strong>{language.name}</strong>
                <small>{language.summary}</small>
                <small className="language-count">
                  {language.entries.length} words
                  {language.vitality === "endangered" ? ", endangered" : ""}
                </small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
