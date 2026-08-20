import { AppShell } from "@/components/layout/AppShell";
import { dictionaryAttribution } from "@/data/languages/kristang";
import { LANGUAGE_TAG } from "@/lib/language";

export default function AboutPage() {
  return (
    <AppShell activePath="/about">
      <div className="page about-page">
        <header className="page-heading">
          <h1><span lang={LANGUAGE_TAG}>Kambradu</span> is Kristang for friend.</h1>
          <p>An independent, text-only place to learn a few Kristang words and keep what they mean to you.</p>
        </header>

        <div className="about-disclosures">
          <details>
            <summary>Sources</summary>
            <p>{dictionaryAttribution.authors}, <cite>{dictionaryAttribution.label}</cite>, {dictionaryAttribution.publisher}, {dictionaryAttribution.year}. Online edition: {dictionaryAttribution.license}.</p>
            <p>Current entries are source checked. They are not presented as speaker attested or partner reviewed.</p>
            <a href={dictionaryAttribution.url} rel="noreferrer" target="_blank">Open the dictionary record</a>
          </details>
          <details>
            <summary>Permissions</summary>
            <p>Kambradu is not community endorsed. New teaching material, recordings and sharing require named partners, permission and review.</p>
          </details>
          <details>
            <summary>Project status</summary>
            <p>Two dictionary-listed words, written recall and browser-saved memories work now. Audio, accounts, sync, uploads and sharing do not.</p>
          </details>
        </div>
      </div>
    </AppShell>
  );
}
