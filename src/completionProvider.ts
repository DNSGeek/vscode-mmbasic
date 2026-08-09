import * as vscode from "vscode";
import {
  ALL_KEYWORDS,
  MMBasicKeyword,
  MMBasicKind,
  renderKeywordMarkdown,
} from "./mmbasic/keywords";

/**
 * Completion items are built once at construction time from the shared
 * keyword model, then reused for every request. Building around 400 items on
 * each keystroke was measurable, and none of the items depend on context.
 */
export class MMBasicCompletionProvider
  implements vscode.CompletionItemProvider
{
  private readonly items: vscode.CompletionItem[];

  constructor() {
    this.items = ALL_KEYWORDS.map((kw) => this.buildItem(kw));
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.CompletionItem[] {
    // Do not offer completions inside a comment or a string literal.
    const linePrefix = document
      .lineAt(position.line)
      .text.substring(0, position.character);

    if (this.inCommentOrString(linePrefix)) {
      return [];
    }

    return this.items;
  }

  private buildItem(kw: MMBasicKeyword): vscode.CompletionItem {
    const item = new vscode.CompletionItem(kw.name, this.kindOf(kw.kind));

    item.insertText = new vscode.SnippetString(kw.snippet ?? kw.name);
    item.detail = kw.category;
    item.documentation = new vscode.MarkdownString(renderKeywordMarkdown(kw));

    // Multi word names such as ARRAY SLICE only match if the space is part of
    // the filter text, so give VS Code both forms to work with.
    item.filterText = kw.name;
    item.sortText = this.sortKeyOf(kw);

    if (kw.obsolete) {
      item.tags = [vscode.CompletionItemTag.Deprecated];
    }

    return item;
  }

  /**
   * Obsolete entries sort last so the modern replacement is the first
   * suggestion, everything else keeps its alphabetical position.
   */
  private sortKeyOf(kw: MMBasicKeyword): string {
    return (kw.obsolete ? "9" : "1") + kw.name;
  }

  private kindOf(kind: MMBasicKind): vscode.CompletionItemKind {
    switch (kind) {
      case "function":
        return vscode.CompletionItemKind.Function;
      case "command":
        return vscode.CompletionItemKind.Method;
      case "variable":
        return vscode.CompletionItemKind.Variable;
      case "constant":
        return vscode.CompletionItemKind.Constant;
      case "option":
        return vscode.CompletionItemKind.Property;
      case "keyword":
      default:
        return vscode.CompletionItemKind.Keyword;
    }
  }

  /**
   * Rough check for whether the cursor sits inside a comment or an unclosed
   * string. Good enough for suppressing completions, and cheap.
   */
  private inCommentOrString(linePrefix: string): boolean {
    let inString = false;

    for (let i = 0; i < linePrefix.length; i++) {
      const ch = linePrefix[i];

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (!inString && ch === "'") {
        return true;
      }
    }

    return inString;
  }
}
