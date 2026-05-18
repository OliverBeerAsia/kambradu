import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  Headphones,
  Mic,
  Play,
  Upload,
  Volume2
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { UserMenu } from "@/components/layout/UserMenu";
import { AccessPill } from "@/components/ui/AccessPill";
import { Waveform } from "@/components/ui/Waveform";
import {
  publicLexiconEntries,
  publicStories,
  reviewQueueSeed,
  starterGoals,
  starterSavedWords
} from "@/data/kristang";

const dailyActions = [
  {
    href: "/practice",
    title: "Continue practice",
    description: "Hear, recall, use, and speaker-check privately.",
    icon: Headphones,
    tone: "coral"
  },
  {
    href: "/builder",
    title: "Build privately",
    description: "Save family words before review.",
    icon: BookOpen,
    tone: "blue"
  },
  {
    href: "/contribute",
    title: "Submit with consent",
    description: "Send review-ready material to stewards.",
    icon: Mic,
    tone: "green"
  }
];

const protectedHrefs = new Set(["/practice", "/learn", "/journal", "/builder", "/saved", "/contribute", "/steward"]);

function prefetchFor(href: string) {
  return protectedHrefs.has(href) ? false : undefined;
}

export default function Home() {
  const previewEntry = publicLexiconEntries[0];

  return (
    <AppShell activePath="/" authSlot={<UserMenu />}>
      <div className="content-grid">
        <section className="main-column" aria-label="Today">
          <div className="section-heading">
            <div>
              <h1>Today</h1>
              <p>A gentle loop to learn, contribute, and keep Kristang alive.</p>
            </div>
            <span className="sun-icon" aria-hidden="true" />
          </div>

          <section className="daily-actions" aria-label="Daily actions">
            {dailyActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  className={`action-card ${action.tone}`}
                  href={action.href}
                  key={action.href}
                  prefetch={prefetchFor(action.href)}
                >
                  <span className="action-icon">
                    <Icon size={31} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{action.title}</strong>
                    <small>{action.description}</small>
                  </span>
                  <ChevronRight size={22} aria-hidden="true" />
                </Link>
              );
            })}
          </section>

          <section className="panel saved-panel" aria-labelledby="saved-heading">
            <div className="panel-title">
              <h2 id="saved-heading">Saved for later</h2>
              <Link href="/saved" prefetch={false}>
                View all (12)
              </Link>
            </div>

            <div className="saved-list">
              {starterSavedWords.map((item) => (
                <article className="saved-row" key={item.id}>
                  <span className="media-thumb media-note" aria-hidden="true" />
                  <button className="play-button" type="button" aria-label={`Play ${item.headword}`}>
                    <Play size={16} />
                  </button>
                  <Waveform />
                  <div className="saved-copy">
                    <strong>{item.headword}</strong>
                    <span>{item.englishGloss}</span>
                    <small>{item.confidence} · next review {item.nextReviewAt}</small>
                  </div>
                  <time>{item.nextReviewAt}</time>
                </article>
              ))}
            </div>
          </section>

          <section className="panel lexical-panel" aria-labelledby="lexical-heading">
            <div className="panel-title">
              <h2 id="lexical-heading">Lexical entry preview</h2>
              <Link href="/lexicon">Open Lexicon</Link>
            </div>

            <article className="lexical-card">
              <div className="lexical-image" aria-hidden="true">
                <span>CASA ORIENTAL</span>
              </div>
              <div className="lexical-copy">
                <div className="lexical-word">
                  <h3>{previewEntry.headword}</h3>
                  <button className="sound-button" type="button" aria-label="Play pronunciation">
                    <Volume2 size={20} aria-hidden="true" />
                  </button>
                </div>
                <p>
                  pronunciation: <strong>{previewEntry.pronunciation}</strong>
                </p>
                <span className="meta-line">
                  {previewEntry.partOfSpeech} <i /> {previewEntry.englishGlosses[0]} <AccessPill level={previewEntry.access} />
                </span>
                <dl>
                  <div>
                    <dt>Meaning</dt>
                    <dd>{previewEntry.englishGlosses.join(", ")}</dd>
                  </div>
                  <div>
                    <dt>Example</dt>
                    <dd>
                      <em>{previewEntry.example}</em>
                      <span>{previewEntry.exampleTranslation}</span>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="record-pronunciation">
                <strong>Record pronunciation</strong>
                <Link className="record-button" href="/contribute" aria-label="Record pronunciation" prefetch={false}>
                  <Mic size={26} aria-hidden="true" />
                </Link>
                <span>00:00 / 00:10</span>
                <Link href="/contribute" prefetch={false}>
                  <Upload size={16} aria-hidden="true" />
                  Upload audio
                </Link>
                <Link href="/contribute" prefetch={false}>
                  <FileText size={16} aria-hidden="true" />
                  Add note
                </Link>
              </div>
            </article>
          </section>

          <section className="record-panel" aria-labelledby="record-heading">
            <h2 id="record-heading">Public browse and private learning</h2>
            <div className="record-grid">
              {[
                { href: "/practice", icon: Headphones, title: "Start practice", description: "Audio-first private recall loop." },
                { href: "/lessons", icon: BookOpen, title: "Browse lessons", description: "Words, phrases, stories, and culture." },
                { href: "/learn", icon: CalendarDays, title: "Plan practice", description: "Small daily multi-track loops." },
                { href: "/builder", icon: FileText, title: "Build lexicon", description: "Personal words and source notes." },
                { href: "/contribute", icon: Upload, title: "Submit material", description: "Consent and review required." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link className="record-tile green-soft" href={item.href} key={item.href} prefetch={prefetchFor(item.href)}>
                    <span>
                      <Icon size={28} aria-hidden="true" />
                    </span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                    <ChevronRight size={18} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
        </section>

        <aside className="right-rail" aria-label="Stewardship">
          <section className="rail-panel hegel-panel">
            <img src="/hegel.png" alt="" width={76} height={76} aria-hidden="true" />
            <div>
              <h2>Hegel check</h2>
              <p>Public entries need source, consent, access, and steward approval before they leave the queue.</p>
            </div>
          </section>

          <section className="rail-panel">
            <div className="rail-title">
              <h2>Stewardship</h2>
              <Link href="/steward" prefetch={false}>
                View all
              </Link>
            </div>
            <div className="review-heading">
              <strong>
                Pending review <span>{reviewQueueSeed.length}</span>
              </strong>
              <small>Entries waiting for community review.</small>
            </div>
            <div className="review-list">
              {reviewQueueSeed.map((item) => (
                <article className="review-row" key={item.id}>
                  <span className="media-thumb media-note" aria-hidden="true">
                    <Play size={16} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <span>Submitted by {item.attributionName}</span>
                    <small>
                      <AccessPill level={item.access} />
                    </small>
                  </div>
                </article>
              ))}
            </div>
            <Link className="rail-link" href="/steward" prefetch={false}>
              Go to review <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </section>

          <section className="rail-panel">
            <div className="rail-title compact-title">
              <h2>Goals</h2>
              <CheckCircle2 size={16} aria-hidden="true" />
            </div>
            <div className="access-list">
              {starterGoals.map((goal) => (
                <article className="access-row open" key={goal.id}>
                  <span>{goal.completedCount}/{goal.targetCount}</span>
                  <div>
                    <strong>{goal.label}</strong>
                    <small>{goal.cadence}</small>
                  </div>
                  <b>{Math.round((goal.completedCount / goal.targetCount) * 100)}%</b>
                </article>
              ))}
            </div>
          </section>

          <section className="rail-panel">
            <div className="rail-title">
              <h2>Stories and phrases</h2>
              <Link href="/stories">View all</Link>
            </div>
            <div className="activity-list">
              {publicStories.map((story) => (
                <article className="activity-row" key={story.id}>
                  <span className="avatar" aria-hidden="true">
                    {story.kind === "story" ? "ST" : "PH"}
                  </span>
                  <div>
                    <p>
                      <strong>{story.title}</strong> {story.summary}
                    </p>
                    <small>{story.access}</small>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
