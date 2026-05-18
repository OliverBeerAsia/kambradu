import Link from "next/link";
import { BookOpen, Bookmark } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { starterSavedWords } from "@/data/kristang";

export default function SavedPage() {
  return (
    <AppShell activePath="/saved" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Saved words</h1>
        </section>

        <section className="saved-word-grid">
          {starterSavedWords.map((word) => (
            <article className="saved-word-card" key={word.id}>
              <Bookmark size={20} aria-hidden="true" />
              <div>
                <h2>{word.headword}</h2>
                <p>{word.englishGloss}</p>
              </div>
              <span>{word.confidence}</span>
              <Link className="saved-review-link" href="/practice" prefetch={false}>
                <BookOpen size={17} aria-hidden="true" />
                Review {word.nextReviewAt}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
