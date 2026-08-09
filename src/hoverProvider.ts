import * as vscode from "vscode";
import {
  MMBASIC_WORD_PATTERN,
  MAX_KEYWORD_WORDS,
  MMBasicKeyword,
  findKeyword,
  findLongestKeyword,
  renderKeywordMarkdown,
} from "./mmbasic/keywords";

export class MMBasicHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    // The default word pattern drops the $ % ! type suffixes and the dot in
    // MM.INFO, so LEFT$ would arrive here as LEFT and never match. Pass the
    // MMBasic pattern explicitly.
    const range = document.getWordRangeAtPosition(
      position,
      MMBASIC_WORD_PATTERN,
    );

    if (!range) {
      return null;
    }

    const line = document.lineAt(position.line).text;
    const match = this.matchAt(line, range);

    if (!match) {
      return null;
    }

    const markdown = new vscode.MarkdownString(
      renderKeywordMarkdown(match.keyword),
    );
    markdown.isTrusted = false;

    return new vscode.Hover(markdown, match.range);
  }

  /**
   * Resolves the hovered word, preferring the longest multi word command it
   * is part of. Hovering either word of "ARRAY SLICE" should describe
   * ARRAY SLICE, not ARRAY, so the search starts up to
   * MAX_KEYWORD_WORDS - 1 words to the left of the cursor.
   */
  private matchAt(
    line: string,
    range: vscode.Range,
  ): { keyword: MMBasicKeyword; range: vscode.Range } | undefined {
    const words = this.wordsWithPositions(line);
    const cursorIndex = words.findIndex(
      (w) => w.start <= range.start.character && w.end >= range.end.character,
    );

    if (cursorIndex < 0) {
      return undefined;
    }

    const firstStart = Math.max(0, cursorIndex - (MAX_KEYWORD_WORDS - 1));

    // Try the earliest possible start first so the longest phrase wins.
    for (let start = firstStart; start <= cursorIndex; start++) {
      const slice = words.slice(start, start + MAX_KEYWORD_WORDS);
      const keyword = findLongestKeyword(slice.map((w) => w.text));

      if (!keyword) {
        continue;
      }

      const wordCount = keyword.name.split(" ").length;
      const last = start + wordCount - 1;

      // The match has to actually cover the word under the cursor.
      if (last < cursorIndex) {
        continue;
      }

      return {
        keyword,
        range: new vscode.Range(
          range.start.line,
          words[start].start,
          range.start.line,
          words[last].end,
        ),
      };
    }

    // Fall back to the single hovered word.
    const keyword = findKeyword(words[cursorIndex].text);
    return keyword ? { keyword, range } : undefined;
  }

  private wordsWithPositions(
    line: string,
  ): { text: string; start: number; end: number }[] {
    const pattern = new RegExp(MMBASIC_WORD_PATTERN.source, "g");
    const out: { text: string; start: number; end: number }[] = [];

    let m: RegExpExecArray | null;
    while ((m = pattern.exec(line)) !== null) {
      out.push({
        text: m[0],
        start: m.index,
        end: m.index + m[0].length,
      });

      // Guard against a zero length match looping forever.
      if (m.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }

    return out;
  }
}
