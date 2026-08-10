/*
 * Generates vim-mmbasic/syntax/mmbasic.vim from the MMBasic keyword model.
 *
 * The vim plugin and the VS Code extension describe the same language, so
 * they read the same tables rather than each keeping a hand-written list.
 *
 * Run: node scripts/generateVimSyntax.js
 */

const fs = require("fs");
const path = require("path");

const { ALL_KEYWORDS } = require("../checkout/keywords.js");

/** Names that are handled by a syn match rule instead of syn keyword. */
const HANDLED_ELSEWHERE = new Set([
  "REM", // the comment rule must win, and a keyword would outrank a match
  "/*", // block comment
  "?", // PRINT shorthand, not a word
  "MM.INFO", // all MM.* go through one syn match
]);

/** Highlight group per model category. Falls back to mmbasicStatement. */
const GROUP_BY_CATEGORY = {
  "Control flow": "mmbasicConditional",
  Declarations: "mmbasicType",
  Subroutines: "mmbasicKeyword",
  "Error handling": "mmbasicKeyword",
  Strings: "mmbasicFunction",
  Conversion: "mmbasicFunction",
  Maths: "mmbasicFunction",
  Arrays: "mmbasicFunction",
  "Bit operations": "mmbasicFunction",
  "Date and time": "mmbasicFunction",
  Touch: "mmbasicFunction",
  "I/O pins": "mmbasicHardware",
  PWM: "mmbasicHardware",
  Timing: "mmbasicHardware",
  Analog: "mmbasicHardware",
  I2C: "mmbasicHardware",
  SPI: "mmbasicHardware",
  "1-Wire": "mmbasicHardware",
  Sensors: "mmbasicHardware",
  "Input devices": "mmbasicHardware",
  Motors: "mmbasicHardware",
  PIO: "mmbasicHardware",
  Memory: "mmbasicHardware",
  System: "mmbasicHardware",
  Graphics: "mmbasicGraphics",
  GUI: "mmbasicGraphics",
  Sound: "mmbasicGraphics",
  Network: "mmbasicNetwork",
  "System variables": "mmbasicConstant",
  Options: "mmbasicStatement",
  Obsolete: "mmbasicObsolete",
};

// Loop keywords live in their own group so the Repeat highlight still works.
const REPEAT = new Set([
  "FOR",
  "NEXT",
  "DO",
  "LOOP",
  "WHILE",
  "WEND",
  "TO",
  "STEP",
  "UNTIL",
  "EXIT",
  "CONTINUE",
]);

const CONDITIONAL = new Set([
  "IF",
  "THEN",
  "ELSE",
  "ELSEIF",
  "END IF",
  "ENDIF",
  "SELECT CASE",
  "CASE",
  "END SELECT",
  "IS",
]);

const TYPES = new Set([
  "INTEGER",
  "FLOAT",
  "STRING",
  "AS",
  "LENGTH",
  "BASE",
]);

const OPERATORS = ["AND", "OR", "NOT", "XOR", "MOD", "INV"];
const BOOLEANS = ["TRUE", "FALSE"];

const PIN_MODES = [
  "DIN",
  "DOUT",
  "AIN",
  "OC",
  "CIN",
  "FIN",
  // "PIN" is deliberately absent. It is both a SETPIN mode (period
  // measurement) and the far more common PIN(gp) function. A word can only
  // belong to one syn keyword group, and colouring PIN(25) as a type would
  // be the worse outcome.
  "INTH",
  "INTL",
  "INTB",
  "PULLUP",
  "PULLDOWN",
  "OFF",
];

/** Explicit overrides where the model category is right but the colour is not. */
const GROUP_OVERRIDE = {
  GOTO: "mmbasicKeyword",
  "ON KEY": "mmbasicKeyword",
  "IRETURN": "mmbasicKeyword",
};

function groupFor(kw) {
  if (GROUP_OVERRIDE[kw.name]) {
    return GROUP_OVERRIDE[kw.name];
  }
  if (CONDITIONAL.has(kw.name)) {
    return "mmbasicConditional";
  }
  if (REPEAT.has(kw.name)) {
    return "mmbasicRepeat";
  }
  if (kw.obsolete) {
    return "mmbasicObsolete";
  }
  if (kw.kind === "function") {
    // A function keeps the Function colour even in a hardware category,
    // because that is what the user is looking at when they read the line.
    const byCategory = GROUP_BY_CATEGORY[kw.category];
    return byCategory === "mmbasicConstant" ? byCategory : "mmbasicFunction";
  }
  return GROUP_BY_CATEGORY[kw.category] || "mmbasicStatement";
}

/** Buckets: single word names go to syn keyword, multi word to syn match. */
const singles = new Map();
const multis = new Map();

for (const kw of ALL_KEYWORDS) {
  const name = kw.name;

  if (HANDLED_ELSEWHERE.has(name) || name.startsWith("MM.")) {
    continue;
  }

  const group = groupFor(kw);

  if (/^[A-Za-z][A-Za-z0-9_]*\$?$/.test(name)) {
    if (!singles.has(group)) {
      singles.set(group, new Set());
    }
    singles.get(group).add(name);
    continue;
  }

  if (/^[A-Za-z][A-Za-z0-9_]*( [A-Za-z0-9_]+)+$/.test(name)) {
    if (!multis.has(group)) {
      multis.set(group, new Set());
    }
    multis.get(group).add(name);
  }
  // Anything else (operators, "MATH(", "SPRITE(") is covered by a rule below.
}

function addSingles(group, names) {
  if (!singles.has(group)) {
    singles.set(group, new Set());
  }
  for (const n of names) {
    singles.get(group).add(n);
  }
}

addSingles("mmbasicConditional", [...CONDITIONAL].filter((n) => !n.includes(" ")));
addSingles("mmbasicRepeat", [...REPEAT]);
addSingles("mmbasicType", [...TYPES]);
addSingles("mmbasicOperator", OPERATORS);
addSingles("mmbasicBoolean", BOOLEANS);
addSingles("mmbasicPinMode", PIN_MODES);

// A pin mode must not also be a statement keyword or the colours fight.
for (const [group, set] of singles) {
  if (group === "mmbasicPinMode") {
    continue;
  }
  for (const mode of PIN_MODES) {
    if (group !== "mmbasicHardware") {
      continue;
    }
    set.delete(mode);
  }
}

function keywordLines(group, names, width = 66) {
  const sorted = [...names].sort();
  const lines = [];
  let current = "";

  for (const name of sorted) {
    const candidate = current ? `${current} ${name}` : name;
    if (candidate.length > width && current) {
      lines.push(`syn keyword ${group} ${current}`);
      current = name;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(`syn keyword ${group} ${current}`);
  }

  return lines.join("\n");
}

/** Multi word commands become a match with flexible whitespace. */
function matchLines(group, names) {
  // Longest first so END SELECT is tried before END, and
  // WEB MQTT PUBLISH before WEB MQTT.
  const sorted = [...names].sort(
    (a, b) => b.length - a.length || a.localeCompare(b),
  );

  return sorted
    .map((name) => {
      const pattern = name.split(" ").join("\\s\\+");
      return `syn match ${group} "\\<${pattern}\\>"`;
    })
    .join("\n");
}

const sections = [];
const groupOrder = [
  ["mmbasicConditional", "conditional"],
  ["mmbasicRepeat", "loops"],
  ["mmbasicKeyword", "subroutines and error handling"],
  ["mmbasicType", "types and declarations"],
  ["mmbasicStatement", "statements"],
  ["mmbasicFunction", "functions"],
  ["mmbasicHardware", "hardware"],
  ["mmbasicGraphics", "graphics and sound"],
  ["mmbasicNetwork", "network"],
  ["mmbasicConstant", "system variables"],
  ["mmbasicOperator", "operators"],
  ["mmbasicBoolean", "booleans"],
  ["mmbasicPinMode", "pin modes"],
  ["mmbasicObsolete", "obsolete"],
];

for (const [group, title] of groupOrder) {
  const parts = [];
  if (singles.has(group)) {
    parts.push(keywordLines(group, singles.get(group)));
  }
  if (multis.has(group)) {
    parts.push(matchLines(group, multis.get(group)));
  }
  if (parts.length) {
    sections.push(`" ${title}\n${parts.join("\n")}`);
  }
}

const total =
  [...singles.values()].reduce((n, s) => n + s.size, 0) +
  [...multis.values()].reduce((n, s) => n + s.size, 0);

const file = `" Vim syntax file
" Language:     MMBasic (PicoMite, PicoMiteVGA, PicoMiteHDMI, WebMite)
" Reference:    PicoMite User Manual V6.03.01
" Maintainer:   Thomas Knox
" Generated:    by scripts/generateVimSyntax.js - do not edit by hand

if exists("b:current_syntax")
  finish
endif

syn case ignore

" MMBasic type suffixes and the MM. prefix are part of the identifier.
" 'syn iskeyword' scopes this to syntax matching, so 'w' motions and the
" user's own 'iskeyword' are unaffected. Without it every \$ function
" (LEFT\$, HEX\$, DIR\$ ...) silently fails to highlight.
if has('patch-7.4.1142')
  syn iskeyword @,48-57,_,36
else
  setlocal iskeyword+=36
endif

" ---------------------------------------------------------------- comments
" Both comment forms, plus the V6 block comment. The apostrophe rule is
" defined before the keyword rules so that a trailing comment wins.
syn keyword mmbasicTodo TODO FIXME XXX NOTE contained
syn match   mmbasicComment "'.*$" contains=mmbasicTodo
syn match   mmbasicComment "\\<REM\\>.*$" contains=mmbasicTodo
syn region  mmbasicComment start="^\\s*/\\*" end="\\*/" contains=mmbasicTodo

" ----------------------------------------------------------------- strings
" MMBasic has no escape character. A quote is built with CHR\$(34), so there
" is nothing to skip, and an unterminated string ends at the line break
" rather than swallowing the rest of the file.
syn region  mmbasicString start=+"+ end=+"+ oneline

" ----------------------------------------------------------------- numbers
syn match   mmbasicNumber "\\<\\d\\+\\>"
syn match   mmbasicLineNumber "^\\s*\\d\\+\\>"
syn match   mmbasicFloat  "\\<\\d\\+\\.\\d*\\([eE][-+]\\=\\d\\+\\)\\="
syn match   mmbasicFloat  "\\<\\d\\+[eE][-+]\\=\\d\\+\\>"
syn match   mmbasicHex    "&[hH]\\x\\+\\>"
syn match   mmbasicBin    "&[bB][01]\\+\\>"
syn match   mmbasicOct    "&[oO][0-7]\\+\\>"

${sections.join("\n\n")}

" ------------------------------------------------------- MM.* system values
" These cannot be syn keyword: '.' is not in 'iskeyword', so MM.VER would
" only ever match as MM. One match rule covers the whole family, including
" names added by future firmware.
syn match   mmbasicConstant "\\<MM\\.[A-Z][A-Z0-9_]*\\\$\\=" 

" -------------------------------------------------------- function variants
" Names the model records with a trailing bracket to distinguish the
" function form from the identically named statement.
syn match   mmbasicFunction "\\<\\(MATH\\|SPRITE\\|DEVICE\\|PIO\\|CLICK\\)\\ze("

" ------------------------------------------------------------------- sync
" Block comments and long SUBs mean a screenful of context is not enough.
syn sync minlines=50

" --------------------------------------------------------------- highlight
hi def link mmbasicComment        Comment
hi def link mmbasicTodo           Todo
hi def link mmbasicLineNumber     LineNr
hi def link mmbasicString         String
hi def link mmbasicNumber         Number
hi def link mmbasicFloat          Float
hi def link mmbasicHex            Number
hi def link mmbasicBin            Number
hi def link mmbasicOct            Number
hi def link mmbasicConditional    Conditional
hi def link mmbasicRepeat         Repeat
hi def link mmbasicStatement      Statement
hi def link mmbasicKeyword        Keyword
hi def link mmbasicType           Type
hi def link mmbasicOperator       Operator
hi def link mmbasicHardware       Special
hi def link mmbasicGraphics       Special
hi def link mmbasicNetwork        Special
hi def link mmbasicFunction       Function
hi def link mmbasicConstant       Constant
hi def link mmbasicPinMode        Type
hi def link mmbasicBoolean        Boolean
hi def link mmbasicObsolete       WarningMsg

let b:current_syntax = "mmbasic"
`;

const outDir = path.join(__dirname, "..", "vim-mmbasic", "syntax");
fs.mkdirSync(outDir, { recursive: true });

const out = path.join(outDir, "mmbasic.vim");
fs.writeFileSync(out, file, "utf8");

console.log(`Wrote ${out} (${total} keywords across ${groupOrder.length} groups)`);
for (const [group] of groupOrder) {
  const s = (singles.get(group) || new Set()).size;
  const m = (multis.get(group) || new Set()).size;
  if (s || m) {
    console.log(`  ${group.padEnd(20)} ${s} keyword, ${m} match`);
  }
}
