"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderKeywordMarkdown =
  exports.findLongestKeyword =
  exports.findKeyword =
  exports.MAX_KEYWORD_WORDS =
  exports.MMBASIC_WORD_PATTERN =
  exports.ALL_KEYWORDS =
    void 0;
const core_1 = require("./data/core");
const strings_1 = require("./data/strings");
const maths_1 = require("./data/maths");
const fileio_1 = require("./data/fileio");
const hardware_1 = require("./data/hardware");
const graphics_1 = require("./data/graphics");
const sound_1 = require("./data/sound");
const network_1 = require("./data/network");
const system_1 = require("./data/system");
const obsolete_1 = require("./data/obsolete");
__exportStar(require("./keywordTypes"), exports);
/** Every keyword the extension knows about. */
exports.ALL_KEYWORDS = [
  ...core_1.CORE_KEYWORDS,
  ...strings_1.STRING_KEYWORDS,
  ...maths_1.MATH_KEYWORDS,
  ...fileio_1.FILEIO_KEYWORDS,
  ...hardware_1.HARDWARE_KEYWORDS,
  ...graphics_1.GRAPHICS_KEYWORDS,
  ...sound_1.SOUND_KEYWORDS,
  ...network_1.NETWORK_KEYWORDS,
  ...system_1.SYSTEM_KEYWORDS,
  ...obsolete_1.OBSOLETE_KEYWORDS,
];
/**
 * Word pattern for MMBasic identifiers.
 *
 * The VS Code default excludes $, % and ! type suffixes and the dot in
 * MM.INFO, which means LEFT$ would match as LEFT and MM.VER as MM. Pass this
 * to getWordRangeAtPosition so those names resolve.
 */
exports.MMBASIC_WORD_PATTERN = /[A-Za-z_][A-Za-z0-9_.]*[$%!]?/;
/**
 * Longest keyword name in words. Used when looking backwards from the cursor
 * to match multi word commands such as WEB MQTT PUBLISH.
 */
exports.MAX_KEYWORD_WORDS = exports.ALL_KEYWORDS.reduce(
  (max, kw) => Math.max(max, kw.name.split(" ").length),
  1,
);
const index = new Map();
for (const kw of exports.ALL_KEYWORDS) {
  const key = kw.name.toUpperCase();
  // First definition wins, so a specific entry is not shadowed by a later one.
  if (!index.has(key)) {
    index.set(key, kw);
  }
}
/** Looks up a keyword by name, case insensitively. */
function findKeyword(name) {
  return index.get(name.trim().toUpperCase());
}
exports.findKeyword = findKeyword;
/**
 * Finds the most specific keyword matching a sequence of words, preferring
 * the longest match. Given ["WEB", "MQTT", "PUBLISH"] this returns the
 * WEB MQTT PUBLISH entry rather than WEB.
 */
function findLongestKeyword(words) {
  for (
    let len = Math.min(words.length, exports.MAX_KEYWORD_WORDS);
    len > 0;
    len--
  ) {
    const hit = findKeyword(words.slice(0, len).join(" "));
    if (hit) {
      return hit;
    }
  }
  return undefined;
}
exports.findLongestKeyword = findLongestKeyword;
/** Builds the markdown body shown in hovers and completion documentation. */
function renderKeywordMarkdown(kw) {
  const parts = [];
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
exports.renderKeywordMarkdown = renderKeywordMarkdown;
//# sourceMappingURL=keywords.js.map
