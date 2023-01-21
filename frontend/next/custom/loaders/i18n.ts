import ts from 'typescript';
import type { DshTransformerFactory } from '.';
import { toBase64 } from '../utils';
import {
  getTranslationSource,
  loadTranslations,
  translate,
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

            const file = getTranslationSource(i18nKey);
            const translation = translate(i18nKey);

            if (file !== null) addDependency(file);

            if (typeof translation === 'string') {
              return factory.createCallExpression(
                factory.createIdentifier('t'),
                undefined,
                [
                  factory.createStringLiteral(toBase64(translation)),
                  data,
                ].filter(Boolean)
              );
            } else {
              // If data is passed, instead of transforming `t('x.y', { ... }).map(...)` directly to
              // `[t('x.y.2', { ... }), t('x.y.1', { ... }), ...].map(...)`, potentially causing side-effects if { ... } is a function with side-effects,
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
                  translation.map((t) =>
                    factory.createCallExpression(
                      factory.createIdentifier('t'),
                      undefined,
                      [
                        factory.createStringLiteral(toBase64(t)),
                        dataRef,
                      ].filter(Boolean)
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
