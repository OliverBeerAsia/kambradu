import { VariantNote } from "kambradu";

/** Same sound, another spelling tradition. */
export const AnotherSpelling = () => (
  <VariantNote lang="mcm" variants={[{ form: "kacoru", orthography: "marbeck", kind: "spelling" }]} />
);

/** A form that sounds different, tied to who is speaking. */
export const AnotherForm = () => (
  <VariantNote lang="mcm" variants={[{ form: "potra", orthography: "baxter-2005", kind: "form" }]} />
);

/** Both kinds together. Nothing is ranked. */
export const Both = () => (
  <VariantNote
    lang="mcm"
    variants={[
      { form: "karni", orthography: "baxter-2005", kind: "form" },
      { form: "kandri", orthography: "marbeck", kind: "spelling" }
    ]}
  />
);
