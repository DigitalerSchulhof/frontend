import {
  MessageFormatElement,
  parse,
} from '@formatjs/icu-messageformat-parser';
import * as ts from 'typescript';
import type { DshTransformerFactory } from '.';
import { getTranslation, loadTranslations } from '../utils/i18n';

export const transformerFactory: DshTransformerFactory =
  ({ options: { isDev }, addDependency }) =>
  (context) =>
  (sourceFile) => {
    if (isDev) {
      loadTranslations();
    }

    function visitor(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node)) {
        let {
          expression,
          arguments: [key, data],
        } = node;
        // Make sure we also visit the body (if provided)
        if (data) data = visitor(data) as ts.Expression;

        if (ts.isIdentifier(expression)) {
          if (expression.text === 't') {
            if (ts.isStringLiteral(key)) {
              const i18nKey = key.text;

              let translation = getTranslation(i18nKey) ?? {
                type: 'string',
                key: i18nKey,
                value: i18nKey,
                ast: parse(i18nKey),
                file: null,
              };

              if (translation.file !== null) addDependency(translation.file);

              return ts.factory.createCallExpression(
                ts.factory.createIdentifier('t'),
                undefined,
                [createTranslationAstObject(translation), data].filter(Boolean)
              );
            } else {
              // Can be called with an expression that evaluates to a `TranslationAST` in which case there is no need to do anything
            }
          } else if (expression.text === 'getTranslation') {
            if (ts.isStringLiteral(key)) {
              const i18nKey = key.text;

              let translation = getTranslation(i18nKey) ?? {
                type: 'string',
                key: i18nKey,
                value: i18nKey,
                ast: parse(i18nKey),
                file: null,
              };

              if (translation.file !== null) addDependency(translation.file);

              return createTranslationAstObject(translation);
            } else {
              throw new Error('getTranslation() key argument must be a string');
            }
          }
        }
      }

      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(sourceFile, visitor);
  };

function createTranslationAstObject(
  translation: {
    key: string;
  } & (
    | {
        ast: MessageFormatElement[];
      }
    | {
        asts: MessageFormatElement[][];
      }
  )
): ts.ObjectLiteralExpression {
  return ts.factory.createObjectLiteralExpression(
    [
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('key'),
        ts.factory.createStringLiteral(translation.key)
      ),
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('ast'),
        'ast' in translation
          ? jsonToTSAst(translation.ast)
          : ts.factory.createArrayLiteralExpression(
              translation.asts.map(jsonToTSAst)
            )
      ),
    ],
    true
  );
}

function jsonToTSAst(json: unknown): ts.Expression {
  switch (typeof json) {
    case 'string':
      return ts.factory.createStringLiteral(json);
    case 'number':
      return ts.factory.createNumericLiteral(json);
    case 'boolean':
      return json ? ts.factory.createTrue() : ts.factory.createFalse();
    case 'object':
      if (json === null) {
        return ts.factory.createNull();
      }
      if (Array.isArray(json)) {
        return ts.factory.createArrayLiteralExpression(json.map(jsonToTSAst));
      }
      return ts.factory.createObjectLiteralExpression(
        Object.entries(json).map(([key, value]) =>
          ts.factory.createPropertyAssignment(
            ts.factory.createStringLiteral(key),
            jsonToTSAst(value)
          )
        )
      );
    default:
      throw new Error(`Unexpected type ${typeof json}`);
  }
}
