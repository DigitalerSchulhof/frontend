import { TranslationEntry, TranslationService } from '#/i18n/server/service';
import { DEFAULT_LOCALE } from '#/utils';
import { __src } from '#/utils/paths';
import * as mfp from '@formatjs/icu-messageformat-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

export class TranslationMapWriter {
  private watcher: TranslationMapWriterWatcher | null = null;

  constructor(private translateService: TranslationService) {}

  writeTranslationMap() {
    const translations =
      this.translateService.getOrLoadTranslations(DEFAULT_LOCALE);

    const translationMapSourceFile = this.getTranslationMapSourceFile([
      ...translations.values(),
    ]);

    const printer = ts.createPrinter();

    fs.writeFileSync(
      path.join(__src, 'i18n', 'translations.d.ts'),
      '/* eslint-disable */\n' + printer.printFile(translationMapSourceFile)
    );
  }

  private getTranslationMapSourceFile(
    translations: TranslationEntry[]
  ): ts.SourceFile {
    const prelude = this.getPreludeStatements();

    const typeDeclaration =
      this.getTranslationMapTypeAliasDeclaration(translations);

    const stringKeysTypeDeclaration =
      this.getStringKeysTypeDeclaration(translations);

    const noVarsKeysTypeDeclaration =
      this.getNoVariablesKeysTypeDeclaration(translations);

    const stringNoVarsKeysTypeDeclaration =
      this.getStringNoVariablesKeysTypeDeclaration(translations);

    return ts.factory.createSourceFile(
      [
        ...prelude,
        typeDeclaration,
        stringKeysTypeDeclaration,
        noVarsKeysTypeDeclaration,
        stringNoVarsKeysTypeDeclaration,
      ],
      ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    );
  }

  private getPreludeStatements() {
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
   * type Translations = {
   *   ...
   * } & ...
   * ```
   */
  private getTranslationMapTypeAliasDeclaration(
    translations: TranslationEntry[]
  ): ts.TypeAliasDeclaration {
    const propertySignaturesTypeLiteral = ts.factory.createTypeLiteralNode(
      translations.map((entry) =>
        this.getTranslationEntryPropertySignature(entry)
      )
    );

    const curlyMappedTypeNode = this.getCurlyMappedTypeNode();

    return ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier('Translations'),
      undefined,
      ts.factory.createIntersectionTypeNode([
        propertySignaturesTypeLiteral,
        curlyMappedTypeNode,
      ])
    );
  }

  /**
   * ```ts
   * export type TranslationsWithStringType = 'key1' | 'key2' | ...
   * ```
   */
  private getStringKeysTypeDeclaration(
    translations: TranslationEntry[]
  ): ts.TypeAliasDeclaration {
    const stringLiteralTypes = translations
      .filter((entry) => {
        const astElements = this.flattenAstElements(entry);

        const hasTagElement = astElements.some(
          (astElement) => astElement.type === mfp.TYPE.tag
        );

        return entry.type === 'string' && !hasTagElement;
      })
      .map((entry) =>
        ts.factory.createLiteralTypeNode(
          ts.factory.createStringLiteral(entry.key)
        )
      );

    return ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier('TranslationsWithStringType'),
      undefined,
      ts.factory.createUnionTypeNode(stringLiteralTypes)
    );
  }

  /**
   * ```ts
   * export type TranslationsWithNoVariables = `{${string}}` | 'key1' | 'key2' | ...
   * ```
   */
  private getNoVariablesKeysTypeDeclaration(
    translations: TranslationEntry[]
  ): ts.TypeAliasDeclaration {
    const noVarTypes = translations
      .filter((entry) => {
        const astElements = this.flattenAstElements(entry);

        const hasVarElement = astElements.some(
          (astElement) =>
            astElement.type !== mfp.TYPE.pound &&
            astElement.type !== mfp.TYPE.literal
        );

        return !hasVarElement;
      })
      .map((entry) =>
        ts.factory.createLiteralTypeNode(
          ts.factory.createStringLiteral(entry.key)
        )
      );

    return ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier('TranslationsWithNoVariables'),
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

  /**
   * ```ts
   * export type TranslationsWithStringTypeAndNoVariables = `{${string}}` | 'key1' | 'key2' | ...
   * ```
   */
  private getStringNoVariablesKeysTypeDeclaration(
    translations: TranslationEntry[]
  ): ts.TypeAliasDeclaration {
    const noVarTypes = translations
      .filter((entry) => {
        const astElements = this.flattenAstElements(entry);

        const hasTagElement = astElements.some(
          (astElement) => astElement.type === mfp.TYPE.tag
        );

        const hasVarElement = astElements.some(
          (astElement) =>
            astElement.type !== mfp.TYPE.pound &&
            astElement.type !== mfp.TYPE.literal
        );

        return entry.type === 'string' && !hasTagElement && !hasVarElement;
      })
      .map((entry) =>
        ts.factory.createLiteralTypeNode(
          ts.factory.createStringLiteral(entry.key)
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

  /**
   * ```ts
   *   "schulhof.xy": {
   *     variables: [ ... ],
   *     type: ...
   *   },
   * ```
   */
  private getTranslationEntryPropertySignature(
    entry: TranslationEntry
  ): ts.PropertySignature {
    const variablePropertySignatures =
      this.getTranslationEntryVariablesPropertySignatures(entry);

    const entryTypeNode = this.getTranslationEntryTypeNode(entry);

    return ts.factory.createPropertySignature(
      undefined,
      ts.factory.createStringLiteral(entry.key),
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
   * {
   *   [K in `{${string}}`]: {
   *     variables: [];
   *     type: string;
   *   }
   * }
   * ```
   */
  private getCurlyMappedTypeNode(): ts.MappedTypeNode {
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
   *  "schulhof.xy": {
   *     type: string | string[] | React.ReactNode | React.ReactNode[]
   * //        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   *   },
   * ```
   */
  private getTranslationEntryTypeNode(entry: TranslationEntry): ts.TypeNode {
    const astElements = this.flattenAstElements(entry);
    const hasTagElement = astElements.some(
      (astElement) => astElement.type === mfp.TYPE.tag
    );

    if (entry.type === 'string') {
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
   *  "schulhof.xy": {
   *     variables: [{
   *       x: string
   * //    ^^^^^^^^^
   *     }]
   *   },
   * ```
   */
  private getTranslationEntryVariablesPropertySignatures(
    entry: TranslationEntry
  ): ts.PropertySignature[] {
    const astElements = this.flattenAstElements(entry);

    const propertySignatures: ts.PropertySignature[] = [];

    // <i> and <b> are in-built
    const seenVariables = new Set(['i', 'b']);

    for (const astElement of astElements) {
      const typeNode = this.convertAstTypeToTsTypeNode(astElement);

      if (typeNode) {
        const variableName = (
          astElement as
            | mfp.ArgumentElement
            | mfp.NumberElement
            | mfp.DateElement
            | mfp.TimeElement
            | mfp.SelectElement
            | mfp.PluralElement
            | mfp.TagElement
        ).value;

        if (seenVariables.has(variableName)) {
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

  private flattenAstElements(
    entry: TranslationEntry
  ): mfp.MessageFormatElement[] {
    const astElements: mfp.MessageFormatElement[] =
      'ast' in entry ? entry.ast : entry.asts.flat();

    for (const astElement of astElements) {
      switch (astElement.type) {
        case mfp.TYPE.plural:
        case mfp.TYPE.select:
          for (const option of Object.values(astElement.options)) {
            astElements.push(...option.value);
          }
          break;
        case mfp.TYPE.tag:
          astElements.push(...astElement.children);
          break;
        case mfp.TYPE.pound:
        case mfp.TYPE.number:
        case mfp.TYPE.date:
        case mfp.TYPE.time:
        case mfp.TYPE.argument:
        case mfp.TYPE.literal:
          break;
      }
    }

    return astElements;
  }

  private convertAstTypeToTsTypeNode(
    astElement: mfp.MessageFormatElement
  ): ts.TypeNode | null {
    switch (astElement.type) {
      case mfp.TYPE.argument:
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
      case mfp.TYPE.number:
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
      case mfp.TYPE.date:
        return ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('Date')
        );
      case mfp.TYPE.time:
        return ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('Date')
        );
      case mfp.TYPE.select:
        return ts.factory.createUnionTypeNode(
          Object.keys(astElement.options)
            .filter((key) => key !== 'other')
            .map((key) =>
              ts.factory.createLiteralTypeNode(
                ts.factory.createStringLiteral(key)
              )
            )
        );
      case mfp.TYPE.plural:
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
      case mfp.TYPE.pound:
        return null;
      case mfp.TYPE.tag:
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
      case mfp.TYPE.literal:
        return null;
    }
  }

  watch(): void {
    if (this.watcher) return;

    this.watcher = new TranslationMapWriterWatcher(this);
    this.watcher.watch();
  }

  async unwatch(): Promise<void> {
    if (!this.watcher) return;

    await this.watcher.unwatch();
    this.watcher = null;
  }
}

class TranslationMapWriterWatcher {
  constructor(private writer: TranslationMapWriter) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- TODO: Add chokidar to translation service
  watch(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- TODO: Add chokidar to translation service
  async unwatch(): Promise<void> {}
}
