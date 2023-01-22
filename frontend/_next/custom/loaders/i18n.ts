import {
  MessageFormatElement,
  parse
} from '@formatjs/icu-messageformat-parser';
import ts from 'typescript';
import type { DshTransformerFactory } from '.';
import {
  getTranslation,
  loadTranslations
} from '../utils/i18n';

export const transformerFactory: DshTransformerFactory =
  ({ options: { isDev }, addDependency }) =>
  (context) =>
  (sourceFile) => {
    if (isDev) {
      loadTranslations();
    }

    const { factory } = context;

    function visitor(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node)) {
        let {
          expression,
          arguments: [arg, data],
        } = node;
        // Make sure we also visit the body
        if (data) data = visitor(data) as ts.Expression;

        if (ts.isIdentifier(expression) && expression.text === 't') {
          if (ts.isStringLiteral(arg)) {
            const i18nKey = arg.text;

            let translation = getTranslation(i18nKey) ?? {
              type: 'string',
              key: i18nKey,
              value: i18nKey,
              ast: parse(i18nKey),
              file: null,
            };

            if (translation.file !== null) addDependency(translation.file);

            if (translation.type === 'string') {
              return createTExpression(translation, data);
            } else {
              // If data is passed, instead of transforming `t('x.y', { ... }).map(...)` directly to
              // `[t('x.y.2', { ... }), t('x.y.1', { ... }), ...].map(...)`, potentially causing side-effects if { ... } is/contains a function with side-effects,
              // we wrap it in a temporary IIFE, so that it's only evaluated once:
              // `(() => {let _temp = { ... }; return [t('x.y.0', _temp), t('x.y.1', _temp), ...]})().map(...)`

              const dataRef = data ? factory.createUniqueName('data') : data;
              const dataWrapper = data
                ? (e: ts.Expression) =>
                    factory.createCallExpression(
                      factory.createParenthesizedExpression(
                        factory.createArrowFunction(
                          undefined,
                          undefined,
                          [],
                          undefined,
                          factory.createToken(
                            ts.SyntaxKind.EqualsGreaterThanToken
                          ),
                          factory.createBlock([
                            factory.createVariableStatement(
                              undefined,
                              factory.createVariableDeclarationList(
                                [
                                  factory.createVariableDeclaration(
                                    dataRef as ts.Identifier,
                                    undefined,
                                    undefined,
                                    data
                                  ),
                                ],
                                ts.NodeFlags.Const
                              )
                            ),
                            factory.createReturnStatement(e),
                          ])
                        )
                      ),
                      undefined,
                      []
                    )
                : (e: ts.Expression) => e;

              return dataWrapper(
                factory.createArrayLiteralExpression(
                  translation.asts.map((ast) =>
                    createTExpression(
                      {
                        key: translation.key,
                        ast,
                      },
                      dataRef
                    )
                  )
                )
              );
            }
          } else {
            throw new Error('t() argument must be a string');
          }
        }
      }

      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(sourceFile, visitor);
  };

function createTExpression(
  translation: { key: string; ast: MessageFormatElement[] },
  data: ts.Expression
): ts.Expression {
  return ts.factory.createCallExpression(
    ts.factory.createIdentifier('t'),
    undefined,
    [
      ts.factory.createStringLiteral(translation.key),
      jsonToTSAst(translation.ast),
      data,
    ].filter(Boolean)
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
