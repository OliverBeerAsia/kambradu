import type {
  Attribution,
  Community,
  Language,
  LexicalEntry,
  OrthographyProfile,
  OrthographyProfileId
} from "@/types/kambradu";

/**
 * Malay.
 *
 * Malay is not endangered: it has hundreds of millions of speakers, a national
 * standards body and abundant learning material. It sits here because a learner
 * asked for it and because it is the language Kristang's spelling is built on,
 * not because Kambradu is the right place to preserve it. The interface says so
 * rather than implying the two languages carry the same urgency.
 *
 * The words below are transcribed from Wiktionary and are marked as not yet
 * checked by a person. That is the honest state, and it is what keeps them out
 * of anything that claims to be verified.
 */

export const malayCommunity: Community = {
  id: "malay",
  name: "Malay",
  languageName: "Malay",
  region: "Malaysia, Singapore, Brunei and Indonesia",
  publicDescription:
    "A widely spoken language with plenty of learning material. It is offered here as a bridge into Kristang.",
  defaultAccess: "open"
};

/**
 * Malay is written in two scripts. Rumi, the Latin script, is standard today;
 * Jawi, the Arabic script, is older and still in use. Both are named here, but
 * only Rumi is populated, because a Jawi form that is not copied from a source
 * would be a guess.
 */
export const malayOrthographies: Record<OrthographyProfileId, OrthographyProfile> = {
  "rumi-1972": {
    id: "rumi-1972",
    label: "Rumi spelling",
    description: "The Latin-script spelling standardised by the 1972 reform, used across Malaysia and Indonesia.",
    basedOn: "Ejaan Rumi Baharu, 1972"
  },
  jawi: {
    id: "jawi",
    label: "Jawi spelling",
    description: "The Arabic-script spelling, older than Rumi and still used in religious and cultural writing.",
    basedOn: "Arabic script adapted for Malay"
  }
};

export const wiktionaryAttribution: Attribution = {
  label: "Wiktionary",
  publisher: "Wikimedia Foundation",
  url: "https://en.wiktionary.org",
  license: "CC BY-SA 4.0"
};

/** Transcribed, not yet checked by a person. The two are different claims. */
const transcribedEvidence = {
  source_transcribed: true,
  source_checked: false,
  speaker_attested: false,
  partner_reviewed: false,
  public_use_allowed: true
};

function entry(
  headword: string,
  glosses: string[],
  partOfSpeech: string,
  tags: string[]
): LexicalEntry {
  return {
    id: headword.replace(/\s+/g, "-"),
    communityId: malayCommunity.id,
    headword,
    normalizedHeadword: headword,
    glosses,
    partOfSpeech,
    orthography: "rumi-1972",
    // Malay stress is not marked in the source and is not settled among
    // descriptions of the language, so nothing is recorded rather than guessed.
    alternateSpellings: [],
    variants: [],
    collocations: [],
    examples: [],
    source: {
      ...wiktionaryAttribution,
      locator: `Entry ${headword}, Malay section`,
      entryUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(headword)}#Malay`
    },
    access: "open",
    evidence: transcribedEvidence,
    hasAudio: false,
    tags: [...tags, "wiktionary-listed"]
  };
}

export const malayEntries: LexicalEntry[] = [
  entry("baik", ["good", "well"], "adjective", ["greetings"]),
  entry("ada", ["to have", "to be present"], "verb", ["greetings"]),
  entry("cakap", ["to speak", "to talk"], "verb", ["daily life"]),

  entry("ibu", ["mother"], "noun", ["family"]),
  entry("bapa", ["father"], "noun", ["family"]),
  entry("anak", ["child"], "noun", ["family"]),
  entry("adik", ["younger sibling"], "noun", ["family"]),
  entry("kawan", ["friend"], "noun", ["people"]),

  entry("rumah", ["house", "home"], "noun", ["home"]),
  entry("pintu", ["door"], "noun", ["home"]),
  entry("tingkap", ["window"], "noun", ["home"]),
  entry("meja", ["table"], "noun", ["home"]),
  entry("kerusi", ["chair"], "noun", ["home"]),

  entry("nasi", ["cooked rice"], "noun", ["food"]),
  entry("roti", ["bread"], "noun", ["food"]),
  entry("ikan", ["fish"], "noun", ["food"]),
  entry("daging", ["meat"], "noun", ["food"]),
  entry("ayam", ["chicken"], "noun", ["food", "animals"]),
  entry("sabun", ["soap"], "noun", ["daily life"]),
  entry("pakaian", ["clothing"], "noun", ["daily life"]),

  entry("kepala", ["head"], "noun", ["body"]),
  entry("tangan", ["hand"], "noun", ["body"]),

  entry("air", ["water"], "noun", ["weather"]),
  entry("hujan", ["rain"], "noun", ["weather"]),
  entry("matahari", ["sun"], "noun", ["weather"]),

  entry("kucing", ["cat"], "noun", ["animals"])
];

export const malay: Language = {
  id: "malay",
  name: "Malay",
  tag: "ms",
  glossTag: "en",
  vitality: "widely-spoken",
  summary: "A widely spoken language, and the one Kristang's spelling is built on.",
  community: malayCommunity,
  orthographies: malayOrthographies,
  attribution: wiktionaryAttribution,
  evidenceNote: "Transcribed from Wiktionary. Not yet checked by a person.",
  entries: malayEntries
};
