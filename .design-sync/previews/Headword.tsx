import { Headword } from "kambradu";

/** A stressed syllable, underlined the way the printed dictionary marks it. */
export const Stressed = () => (
  <h1>
    <Headword form="sabang" stress={{ start: 2, end: 5 }} lang="mcm" />
  </h1>
);

/** A monosyllable. The source marks no stress, so none is drawn. */
export const Unmarked = () => (
  <h1>
    <Headword form="sol" lang="mcm" />
  </h1>
);

/** Inside running text, where the mark is smaller but still visible. */
export const InASentence = () => (
  <p style={{ margin: 0 }}>
    Say <Headword form="kachoru" stress={{ start: 3, end: 5 }} lang="mcm" /> out loud.
  </p>
);
