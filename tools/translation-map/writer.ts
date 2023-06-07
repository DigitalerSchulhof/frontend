import {
  TranslationEntry,
  expandTranslations,
  flattenAst,
  getTranslations,
} from '#/context/contexts/i18n/service';
import { DEFAULT_LOCALE } from '#/utils';
import { __src } from '#/utils/paths';
import {
  ArgumentElement,
  DateElement,
  MessageFormatElement,
  NumberElement,
  PluralElement,
  SelectElement,
  TYPE,
  TagElement,
  TimeElement,
} from '@formatjs/icu-messageformat-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

export function writeTranslationsMap(): void {
  const translations = getTranslations(DEFAULT_LOCALE);
  const expandedTranslations = expandTranslations(translations);

  const translationsMap = createTranslationsMapSourceFile(expandedTranslations);

  const printer = ts.createPrinter();

  fs.writeFileSync(
    path.join(__src, 'i18n', 'translations.d.ts'),
    `/* eslint-disable */\n${printer.printFile(translationsMap)}`
  );
}

function createTranslationsMapSourceFile(
  translations: ReadonlyMap<string, TranslationEntry>
): ts.SourceFile {
  return ts.factory.createSourceFile(
    [
      ...createHeader(),
      createTranslationsMapAndCurly(translations),
      createStringTypeNoVariablesKeysUnion(translations),
    ],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );
}

/**
 * ```ts
 * import { FormatXMLElementFn } from 'intl-messageformat';
 * ```
 */
function createHeader(): ts.Statement[] {
  return [
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        true,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier('FormatXMLElementFn')
          ),
        ])
      ),
      ts.factory.createStringLiteral('intl-messageformat'),
      undefined
    ),
  ];
}

/**
 * ```ts
 * export type Translations = {
 *   // Translations map
 * } & {
 *   // Curly mapped type
 * }
 * ```
 */
function createTranslationsMapAndCurly(
  translations: ReadonlyMap<string, TranslationEntry>
): ts.Statement {
  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('Translations'),
    undefined,
    ts.factory.createIntersectionTypeNode([
      createTranslationsMap(translations),
      createCurlyMapped(),
    ])
  );
}

/**
 * ```ts
 * {
 *   // Translations map
 * }
 * ```
 */
function createTranslationsMap(
  translations: ReadonlyMap<string, TranslationEntry>
): ts.TypeNode {
  return ts.factory.createTypeLiteralNode(
    [...translations.values()].map(createTranslationEntryPropertySignature)
  );
}

/**
 * ```ts
 *   "schulhof.xy": {
 *     variables: [ ... ],
 *     type: ...
 *   },
 * ```
 */
function createTranslationEntryPropertySignature(
  translation: TranslationEntry
): ts.PropertySignature {
  const variablePropertySignatures =
    createTranslationEntryVariablesPropertySignatures(translation);

  const entryTypeNode = createTranslationTypeNode(translation);

  return ts.factory.createPropertySignature(
    undefined,
    ts.factory.createStringLiteral(translation.key),
    undefined,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('variables'),
        undefined,
        ts.factory.createTupleTypeNode(
          variablePropertySignatures.length
            ? [ts.factory.createTypeLiteralNode(variablePropertySignatures)]
            : []
        )
      ),
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('type'),
        undefined,
        entryTypeNode
      ),
    ])
  );
}

/**
 * ```ts
 *  "schulhof.xy": {
 *     variables: [{
 *       x: string
 * //    ^^^^^^^^^
 *     }]
 *   },
 * ```
 */
function createTranslationEntryVariablesPropertySignatures(
  translation: TranslationEntry
): ts.PropertySignature[] {
  const propertySignatures: ts.PropertySignature[] = [];
  const ast = flattenAst(translation);

  // <i> and <b> are in-built
  const seenVariables = new Set(['i', 'b', 'u']);

  for (const astElement of ast) {
    const typeNode = convertAstTypeToTsTypeNode(astElement);

    if (typeNode) {
      const variableName = (
        astElement as
          | ArgumentElement
          | NumberElement
          | DateElement
          | TimeElement
          | SelectElement
          | PluralElement
          | TagElement
      ).value;

      if (seenVariables.has(variableName)) {
        // TODO: If the variable is used multiple times,
        // we have to combine the types
        continue;
      }
      seenVariables.add(variableName);

      propertySignatures.push(
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createStringLiteral(variableName),
          undefined,
          typeNode
        )
      );
    }
  }

  return propertySignatures;
}

function convertAstTypeToTsTypeNode(
  astElement: MessageFormatElement
): ts.TypeNode | null {
  switch (astElement.type) {
    case TYPE.argument:
      return ts.factory.createUnionTypeNode([
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
      ]);
    case TYPE.number:
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case TYPE.date:
      return ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('Date')
      );
    case TYPE.time:
      return ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('Date')
      );
    case TYPE.select:
      return ts.factory.createUnionTypeNode(
        Object.keys(astElement.options)
          .filter((key) => key !== 'other')
          .map((key) =>
            ts.factory.createLiteralTypeNode(
              ts.factory.createStringLiteral(key)
            )
          )
      );
    case TYPE.plural:
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case TYPE.tag:
      return ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('FormatXMLElementFn'),
        [
          ts.factory.createUnionTypeNode([
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier('JSX.Element')
            ),
          ]),
          ts.factory.createUnionTypeNode([
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier('JSX.Element')
            ),
            ts.factory.createArrayTypeNode(
              ts.factory.createUnionTypeNode([
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                ts.factory.createTypeReferenceNode(
                  ts.factory.createIdentifier('JSX.Element')
                ),
              ])
            ),
          ]),
        ]
      );
    case TYPE.template:
      throw new Error(
        "Expanded translation shouldn't contain template elements."
      );
    case TYPE.pound:
    case TYPE.literal:
      return null;
  }
}

/**
 * ```ts
 *  "schulhof.xy": {
 *     type: string | string[] | React.ReactNode | React.ReactNode[]
 * //        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *   },
 * ```
 */
function createTranslationTypeNode(translation: TranslationEntry): ts.TypeNode {
  const ast = flattenAst(translation);

  const hasTagElement = ast.some((astElement) => astElement.type === TYPE.tag);

  if (translation.type === 'string') {
    if (hasTagElement) {
      return ts.factory.createTypeReferenceNode(
        ts.factory.createQualifiedName(
          ts.factory.createIdentifier('React'),
          ts.factory.createIdentifier('ReactNode')
        )
      );
    } else {
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    }
  } else {
    if (hasTagElement) {
      return ts.factory.createArrayTypeNode(
        ts.factory.createTypeReferenceNode(
          ts.factory.createQualifiedName(
            ts.factory.createIdentifier('React'),
            ts.factory.createIdentifier('ReactNode')
          )
        )
      );
    } else {
      return ts.factory.createArrayTypeNode(
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      );
    }
  }
}

/**
 * ```ts
 * {
 *   [K in `{${string}}`]: {
 *     variables: [];
 *     type: string;
 *   }
 * }
 * ```
 */
function createCurlyMapped(): ts.TypeNode {
  return ts.factory.createMappedTypeNode(
    undefined,
    ts.factory.createTypeParameterDeclaration(
      undefined,
      ts.factory.createIdentifier('K'),
      ts.factory.createTemplateLiteralType(
        ts.factory.createTemplateHead('{', '{'),
        [
          ts.factory.createTemplateLiteralTypeSpan(
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.factory.createTemplateTail('}', '}')
          ),
        ]
      ),
      undefined
    ),
    undefined,
    undefined,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('variables'),
        undefined,
        ts.factory.createTupleTypeNode([])
      ),
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('type'),
        undefined,
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      ),
    ]),
    ts.factory.createNodeArray([])
  );
}

/**
 * ```ts
 * export type TranslationsWithStringTypeAndNoVariables = `{${string}}` | 'key1' | 'key2' | ...
 * ```
 */
function createStringTypeNoVariablesKeysUnion(
  translations: ReadonlyMap<string, TranslationEntry>
): ts.Statement {
  const noVarTypes = [...translations.values()]
    .filter((translation) => {
      const ast = flattenAst(translation);

      const hasTagElement = ast.some(
        (astElement) => astElement.type === TYPE.tag
      );

      const hasVarElement = ast.some(
        (astElement) =>
          astElement.type !== TYPE.pound && astElement.type !== TYPE.literal
      );

      return translation.type === 'string' && !hasTagElement && !hasVarElement;
    })
    .map((translation) =>
      ts.factory.createLiteralTypeNode(
        ts.factory.createStringLiteral(translation.key)
      )
    );

  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('TranslationsWithStringTypeAndNoVariables'),
    undefined,
    ts.factory.createUnionTypeNode([
      ts.factory.createTemplateLiteralType(
        ts.factory.createTemplateHead('{', '{'),
        [
          ts.factory.createTemplateLiteralTypeSpan(
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ts.factory.createTemplateTail('}', '}')
          ),
        ]
      ),
      ...noVarTypes,
    ])
  );
}
