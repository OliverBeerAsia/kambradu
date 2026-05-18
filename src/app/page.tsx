import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, Headphones, Library, PenLine } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { AccessPill } from "@/components/ui/AccessPill";
import { starterSavedWords } from "@/data/kristang";

const nextActions = [
  {
    href: "/practice",
    title: "Practice",
    icon: Headphones
  },
  {
    href: "/lessons",
    title: "Browse",
    icon: Library
  },
  {
    href: "/builder",
    title: "Build",
    icon: PenLine
  }
];

export default function Home() {
  return (
    <AppShell activePath="/" authSlot={<UserMenu />}>
      <div className="route-page today-page">
        <section className="route-heading compact-route-heading">
          <h1>Today</h1>
        </section>

        <section className="today-focus" aria-label="Today">
          <article className="today-primary-card">
            <span className="workbench-label">Next step</span>
            <h2>Shop visit</h2>
            <p>Practice the phrase, then save one private note.</p>
            <Link className="primary-action today-primary-action" href="/practice" prefetch={false}>
              Continue
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </article>

          <aside className="today-helper-card">
            <img src="/hegel.png" alt="" width={58} height={58} aria-hidden="true" />
            <div>
              <h2>Private first</h2>
              <p>Share only after consent and review.</p>
            </div>
          </aside>
        </section>

        <section className="today-actions" aria-label="Main actions">
          {nextActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link className="today-action" href={action.href} key={action.href} prefetch={false}>
                <Icon size={24} aria-hidden="true" />
                <span>{action.title}</span>
                <ChevronRight size={18} aria-hidden="true" />
              </Link>
            );
          })}
        </section>

        <section className="simple-panel" aria-labelledby="saved-heading">
          <div className="simple-panel-heading">
            <h2 id="saved-heading">Saved words</h2>
            <Link href="/saved" prefetch={false}>
              View
            </Link>
          </div>
          <div className="simple-list">
            {starterSavedWords.map((item) => (
              <article className="simple-row" key={item.id}>
                <BookOpen size={18} aria-hidden="true" />
                <strong>{item.headword}</strong>
                <span>{item.englishGloss}</span>
                <small>{item.nextReviewAt}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="simple-panel" aria-labelledby="review-heading">
          <div className="simple-panel-heading">
            <h2 id="review-heading">Review state</h2>
            <Link href="/steward" prefetch={false}>
              Open
            </Link>
          </div>
          <div className="simple-row review-state-row">
            <CheckCircle2 size={18} aria-hidden="true" />
            <strong>Family greeting</strong>
            <span>Approved locally</span>
            <AccessPill level="community" />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
