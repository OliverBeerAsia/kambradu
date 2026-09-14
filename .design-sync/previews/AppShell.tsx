import { AppShell } from "kambradu";

/** The three-place shell around a learner screen, with Learn active. */
export const LearnActive = () => (
  <AppShell activePath="/learn">
    <div className="page">
      <header className="page-heading">
        <h1>Learn a word.</h1>
        <p>121 Kristang words, grouped by where you might use them.</p>
      </header>
    </div>
  </AppShell>
);

/** Practice mode: navigation gives way to a quiet way out. */
export const Immersive = () => (
  <AppShell activePath="/learn" immersive>
    <div className="page">
      <header className="page-heading">
        <h1>
          What does <span lang="mcm">sabang</span> mean?
        </h1>
      </header>
    </div>
  </AppShell>
);
