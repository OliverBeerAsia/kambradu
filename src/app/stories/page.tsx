import { FileText } from "lucide-react";
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
          {publicStories.length ? publicStories.map((story) => (
            <article className="story-card" key={story.id}>
              <div className="story-icon">
                <FileText size={28} aria-hidden="true" />
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
          )) : (
            <article className="story-card">
              <div className="story-icon"><FileText size={28} aria-hidden="true" /></div>
              <div>
                <h2>Stories will be added with permission</h2>
                <p>Kambradu does not publish community stories without a named source, clear permission and appropriate review.</p>
              </div>
            </article>
          )}
        </section>
      </div>
    </AppShell>
  );
}
