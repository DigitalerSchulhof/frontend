import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { TYPE } from '@formatjs/icu-messageformat-parser';
import type { TranslationEntry } from '.';

export function flattenAst(
  translation: TranslationEntry
): MessageFormatElement[] {
  const ast =
    translation.type === 'string'
      ? [...translation.ast]
      : translation.asts.flat();

  for (const astElement of ast) {
    switch (astElement.type) {
      case TYPE.plural:
      case TYPE.select:
        for (const option of Object.values(astElement.options)) {
          ast.push(...option.value);
        }
        break;
      case TYPE.tag:
        ast.push(...astElement.children);
        break;
      case TYPE.pound:
      case TYPE.number:
      case TYPE.date:
      case TYPE.time:
      case TYPE.argument:
      case TYPE.literal:
      case TYPE.template:
        break;
    }
  }

  return ast;
}
