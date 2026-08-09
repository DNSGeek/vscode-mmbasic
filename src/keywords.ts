import { MMBasicKeyword, MMBasicKeywordList } from "./keywordTypes";
import { CORE_KEYWORDS } from "./data/core";
import { STRING_KEYWORDS } from "./data/strings";
import { MATH_KEYWORDS } from "./data/maths";
import { FILEIO_KEYWORDS } from "./data/fileio";
import { HARDWARE_KEYWORDS } from "./data/hardware";
import { GRAPHICS_KEYWORDS } from "./data/graphics";
import { SOUND_KEYWORDS } from "./data/sound";
import { NETWORK_KEYWORDS } from "./data/network";
import { SYSTEM_KEYWORDS } from "./data/system";
import { OBSOLETE_KEYWORDS } from "./data/obsolete";

export * from "./keywordTypes";

/** Every keyword the extension knows about. */
export const ALL_KEYWORDS: MMBasicKeywordList = [
  ...CORE_KEYWORDS,
  ...STRING_KEYWORDS,
  ...MATH_KEYWORDS,
  ...FILEIO_KEYWORDS,
  ...HARDWARE_KEYWORDS,
  ...GRAPHICS_KEYWORDS,
  ...SOUND_KEYWORDS,
  ...NETWORK_KEYWORDS,
  ...SYSTEM_KEYWORDS,
  ...OBSOLETE_KEYWORDS,
];

/**
 * Word pattern for MMBasic identifiers.
 *
 * The VS Code default excludes $, % and ! type suffixes and the dot in
 * MM.INFO, which means LEFT$ would match as LEFT and MM.VER as MM. Pass this
 * to getWordRangeAtPosition so those names resolve.
 */
export const MMBASIC_WORD_PATTERN = /[A-Za-z_][A-Za-z0-9_.]*[$%!]?/;

/**
 * Longest keyword name in words. Used when looking backwards from the cursor
 * to match multi word commands such as WEB MQTT PUBLISH.
 */
export const MAX_KEYWORD_WORDS = ALL_KEYWORDS.reduce(
  (max, kw) => Math.max(max, kw.name.split(" ").length),
  1,
);

const index = new Map<string, MMBasicKeyword>();
for (const kw of ALL_KEYWORDS) {
  const key = kw.name.toUpperCase();
  // First definition wins, so a specific entry is not shadowed by a later one.
  if (!index.has(key)) {
    index.set(key, kw);
  }
}

/** Looks up a keyword by name, case insensitively. */
export function findKeyword(name: string): MMBasicKeyword | undefined {
  return index.get(name.trim().toUpperCase());
}

/**
 * Finds the most specific keyword matching a sequence of words, preferring
 * the longest match. Given ["WEB", "MQTT", "PUBLISH"] this returns the
 * WEB MQTT PUBLISH entry rather than WEB.
 */
export function findLongestKeyword(
  words: string[],
): MMBasicKeyword | undefined {
  for (let len = Math.min(words.length, MAX_KEYWORD_WORDS); len > 0; len--) {
    const hit = findKeyword(words.slice(0, len).join(" "));
    if (hit) {
      return hit;
    }
  }
  return undefined;
}

/** Builds the markdown body shown in hovers and completion documentation. */
export function renderKeywordMarkdown(kw: MMBasicKeyword): string {
  const parts: string[] = [];

  parts.push("```mmbasic\n" + kw.syntax.join("\n") + "\n```");
  parts.push(kw.summary);

  if (kw.obsolete) {
    const replacement = kw.replacedBy ? ` Use ${kw.replacedBy} instead.` : "";
    parts.push(`_Obsolete - kept for compatibility._${replacement}`);
  }

  if (kw.variants && kw.variants.length > 0) {
    parts.push(`_Firmware: ${kw.variants.join(", ")}_`);
  }

  if (kw.notes && kw.notes.length > 0) {
    parts.push(kw.notes.map((n) => `- ${n}`).join("\n"));
  }

  if (kw.example) {
    parts.push("**Example**\n\n```mmbasic\n" + kw.example + "\n```");
  }

  return parts.join("\n\n");
}
