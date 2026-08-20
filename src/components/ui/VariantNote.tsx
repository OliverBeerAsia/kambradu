import { LANGUAGE_TAG } from "@/lib/language";
import type { FormVariant } from "@/types/kambradu";

/**
 * The other forms a word takes.
 *
 * Kristang has no written standard agreed across its communities, and neither
 * do most of the languages this is built to serve. Variation is the ordinary
 * state of such a language, not an untidiness to be resolved, so the forms are
 * shown together and none of them is presented as the one to use.
 *
 * A different spelling and a different form are different claims, so they are
 * worded differently: one is about how the word is written, the other about how
 * it is said.
 */
export function VariantNote({ variants }: { variants: FormVariant[] }) {
  if (!variants.length) return null;

  return (
    <p className="variant-note">
      {variants.map((variant) => (
        <span key={`${variant.orthography}-${variant.form}`}>
          {variant.kind === "form" ? "Also said " : "Also written "}
          <span lang={LANGUAGE_TAG}>{variant.form}</span>.{" "}
        </span>
      ))}
      <span className="variant-caveat">No form here is more correct than another.</span>
    </p>
  );
}
