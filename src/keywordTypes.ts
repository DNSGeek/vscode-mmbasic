/**
 * Shared data model for MMBasic language knowledge.
 *
 * Both the completion provider and the hover provider read from this model,
 * so a keyword only ever needs to be described once.
 *
 * Syntax signatures follow the PicoMite User Manual V6.03.01 reference
 * sections. Descriptions and examples are written for this extension.
 */

export type MMBasicKind =
  | "command"
  | "function"
  | "keyword"
  | "variable"
  | "option"
  | "constant";

/**
 * Firmware builds a keyword is available on. Omit for keywords that are
 * present in every build.
 */
export type MMBasicVariant =
  | "PicoMite"
  | "PicoMiteVGA"
  | "PicoMiteHDMI"
  | "PicoMiteUSB"
  | "WebMite"
  | "PicoMiteBT"
  | "PicoCalc";

export interface MMBasicKeyword {
  /**
   * Canonical name as the user types it. May contain a space for two-word
   * commands, e.g. "ARRAY SLICE", "WEB MQTT PUBLISH".
   */
  name: string;

  kind: MMBasicKind;

  /** Group shown in the completion detail line, e.g. "Graphics". */
  category: string;

  /** One or more syntax forms. First entry is the canonical form. */
  syntax: string[];

  /** Single sentence shown in the completion list and hover heading. */
  summary: string;

  /** Optional extra paragraphs or bullet lines for the hover popup. */
  notes?: string[];

  /** Example MMBasic source. Rendered as a fenced mmbasic block. */
  example?: string;

  /**
   * Completion snippet body (VS Code SnippetString syntax).
   * Defaults to the plain name when omitted.
   */
  snippet?: string;

  /** Builds this keyword is restricted to. Omit for "all builds". */
  variants?: MMBasicVariant[];

  /** True for entries kept only for backwards compatibility. */
  obsolete?: boolean;

  /** Name of the preferred replacement when obsolete. */
  replacedBy?: string;
}

/** Convenience alias for the data files. */
export type MMBasicKeywordList = readonly MMBasicKeyword[];
