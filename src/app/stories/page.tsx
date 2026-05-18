import { FileText, Play } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AccessPill } from "@/components/ui/AccessPill";
import { publicStories } from "@/data/kristang";

export default function StoriesPage() {
  return (
    <AppShell activePath="/stories">
      <div className="route-page">
        <section className="route-heading">
          <h1>Phrases and stories</h1>
        </section>

        <section className="story-grid">
          {publicStories.map((story) => (
            <article className="story-card" key={story.id}>
              <div className="story-icon">
                {story.kind === "story" ? <FileText size={28} aria-hidden="true" /> : <Play size={28} aria-hidden="true" />}
              </div>
              <div>
                <h2>{story.title}</h2>
                <p>{story.summary}</p>
                <blockquote>
                  <span>{story.body}</span>
                  {story.translation ? <small>{story.translation}</small> : null}
                </blockquote>
              </div>
              <footer>
                <AccessPill level={story.access} />
                <span>{story.source?.license}</span>
              </footer>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
