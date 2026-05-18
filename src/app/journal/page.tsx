import { BookOpen, FileText } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";

export default function JournalPage() {
  return (
    <AppShell activePath="/journal" authSlot={<UserMenu />}>
      <div className="route-page">
        <section className="route-heading">
          <h1>Private journal</h1>
          <p>Personal learning notes are private to the signed-in learner and are not cached as public content.</p>
        </section>

        <section className="learner-grid">
          <article className="journal-editor">
            <h2>Today’s note</h2>
            <label>
              Title
              <input defaultValue="Words from the shop" />
            </label>
            <label>
              Journal entry
              <textarea
                defaultValue="Practise loja, balcao, and papiá. Ask family for pronunciation before submitting public notes."
                rows={8}
              />
            </label>
            <button className="primary-action" type="button">
              <FileText size={18} aria-hidden="true" />
              Save private note
            </button>
          </article>

          <aside className="rail-panel">
            <div className="rail-title compact-title">
              <h2>Review queue</h2>
              <BookOpen size={17} aria-hidden="true" />
            </div>
            <div className="mini-review-list">
              {["loja", "balcao", "janela", "papiá"].map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
