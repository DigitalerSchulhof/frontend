import {
  ArgumentElement,
  DateElement,
  NumberElement,
  PluralElement,
  SelectElement,
  TagElement,
  TimeElement,
  TYPE,
} from '@formatjs/icu-messageformat-parser';
import fs from 'fs';
import path from 'path';
import ts, { textChangeRangeNewSpan } from 'typescript';
import { __src } from '../utils';
import { getTranslations, TranslationEntry } from '../utils/i18n';

export function generateI18n() {
  const printer = ts.createPrinter();
  const translations = getTranslations();

  const imports = [
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

  const argumentTypes = [
    ts.factory.createTypeAliasDeclaration(
      undefined,
      ts.factory.createIdentifier('StringArgumentType'),
      undefined,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
    ),
    ts.factory.createTypeAliasDeclaration(
      undefined,
      ts.factory.createIdentifier('NumberArgumentType'),
      undefined,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
    ),
    ts.factory.createTypeAliasDeclaration(
      undefined,
      ts.factory.createIdentifier('DateArgumentType'),
      undefined,
      ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date'))
    ),
    ts.factory.createTypeAliasDeclaration(
      undefined,
      ts.factory.createIdentifier('SelectArgumentType'),
      undefined,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
    ),
    ts.factory.createTypeAliasDeclaration(
      undefined,
      ts.factory.createIdentifier('PluralArgumentType'),
      undefined,
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
    ),
    ts.factory.createTypeAliasDeclaration(
      undefined,
      ts.factory.createIdentifier('FormatElementType'),
      undefined,
      ts.factory.createTypeReferenceNode(
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
      )
    ),
  ];

  const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    'Translations',
    undefined,
    undefined,
    Object.entries(translations).map(generateTranslationEntry)
  );

  const sourceFile = ts.factory.createSourceFile(
    [...imports, ...argumentTypes, interfaceDeclaration],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );

  fs.writeFileSync(
    path.join(__src, 'i18n/translations.d.ts'),
    printer.printFile(sourceFile)
  );
}

const INBUILT = ['b', 'i'];

function generateTranslationEntry([key, value]: [
  string,
  TranslationEntry
]): ts.TypeElement {
  const parts: ts.TypeNode[] = [];

  const combinedAst = value.type === 'string' ? value.ast : value.asts.flat();
  const args = [];

  for (let i = 0; i < combinedAst.length; i++) {
    const ast = combinedAst[i];
    let type: ts.TypeNode | null = null;

    switch (ast.type) {
      case TYPE.argument:
        type = ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('StringArgumentType')
        );
        break;
      case TYPE.number:
        type = ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('NumberArgumentType')
        );
        break;
      case TYPE.date:
        type = ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('DateArgumentType')
        );
        break;
      case TYPE.time:
        type = ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('DateArgumentType')
        );
        break;
      case TYPE.select:
        type = ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('SelectArgumentType')
        );
        break;
      case TYPE.plural:
        type = ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('PluralArgumentType')
        );
        break;
      case TYPE.tag:
        type = ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier('FormatElementType')
        );
        combinedAst.push(...ast.children);
        break;
    }

    if (type) {
      const name = (
        ast as
          | ArgumentElement
          | NumberElement
          | DateElement
          | TimeElement
          | SelectElement
          | PluralElement
          | TagElement
      ).value;

      if (INBUILT.includes(name)) {
        continue;
      }

      args.push(
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createStringLiteral(name),
          undefined,
          type
        )
      );
    }
  }

  // If data is required, push the `[data: { ... }]` tuple, else push an empty tuple
  // We use it with `(key: K, ...[data]: Translations[K][0]): Translations[K][1]`, so this way, we only need to pass the data if it's required
  if (args.length) {
    parts.push(
      ts.factory.createTupleTypeNode([
        ts.factory.createNamedTupleMember(
          undefined,
          ts.factory.createIdentifier('data'),
          undefined,
          ts.factory.createTypeLiteralNode(args)
        ),
      ])
    );
  } else {
    parts.push(ts.factory.createTupleTypeNode([]));
  }

  if (value.type === 'string') {
    parts.push(ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword));
  } else {
    parts.push(
      ts.factory.createArrayTypeNode(
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
      )
    );
  }

  return ts.factory.createPropertySignature(
    undefined,
    ts.factory.createStringLiteral(key),
    undefined,
    ts.factory.createTupleTypeNode(parts)
  );
}

generateI18n();
