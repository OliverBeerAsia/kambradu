import { HegelCompanion, hegelPortrait } from "kambradu";

/** On Today: the heading and one supporting sentence beside the portrait. */
export const OnToday = () => (
  <HegelCompanion portraitSrc={hegelPortrait}>
    <h1>Learn your first Kristang word.</h1>
    <p>One word, one quick check and a place to keep it.</p>
  </HegelCompanion>
);

/** On completion: the smaller portrait. */
export const Compact = () => (
  <HegelCompanion compact portraitSrc={hegelPortrait}>
    <h1>
      You reviewed <span lang="mcm">sabang</span>.
    </h1>
    <p>It is kept in Memories.</p>
  </HegelCompanion>
);
