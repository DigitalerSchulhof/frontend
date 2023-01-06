import * as ts from 'typescript';
import {
  findNearestPackageJson,
  LOCALE,
  readJsonSync,
  toBase64,
} from '../../utils';
import {
  getTranslation,
  getTranslationOrigin,
  reloadTranslations,
} from '../../i18n';
import * as fs from 'fs';
import type { DshTransformerFactory } from '.';

export const transformerFactory: DshTransformerFactory =
  ({ options: { isDev }, addDependency }) =>
  (context) =>
  (sourceFile) => {
    if (isDev) {
      reloadTranslations();
    }

    const { factory } = context;

    function visitor(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node)) {
        const {
          expression,
          arguments: [arg, ...args],
        } = node;
        if (ts.isIdentifier(expression) && expression.text === 't') {
          if (ts.isStringLiteral(arg)) {
            const i18nKey = arg.text;
            const packageName = readJsonSync(
              findNearestPackageJson(sourceFile.fileName)
            ).name;

            const file = getTranslationOrigin(packageName, i18nKey, LOCALE);
            const translation = getTranslation(packageName, i18nKey, LOCALE);

            if (file !== null) addDependency(fs.realpathSync(file));

            if (typeof translation !== 'string') {
              throw new Error("t() doesn't support arrays");
            }

            return factory.createCallExpression(
              factory.createIdentifier('t'),
              undefined,
              [factory.createStringLiteral(toBase64(translation)), ...args]
            );
          } else {
            throw new Error('t() argument must be a string');
          }
        }
      } else if (ts.isJsxElement(node)) {
        const {
          openingElement: { tagName: openingTagName },
          children,
        } = node;
        if (ts.isIdentifier(openingTagName) && openingTagName.text === 'T') {
          if (children.length !== 1) {
            throw new Error('<T> can have only one child');
          }
          const [child] = children;
          if (!ts.isJsxText(child)) {
            throw new Error('<T> child must be a string');
          }
          const i18nKey = child.text.trim();
          const packageName = readJsonSync(
            findNearestPackageJson(sourceFile.fileName)
          ).name;

          const file = getTranslationOrigin(packageName, i18nKey, LOCALE);
          const translation = getTranslation(packageName, i18nKey, LOCALE);

          if (file !== null) addDependency(fs.realpathSync(file));

          if (typeof translation === 'string') {
            return factory.updateJsxElement(
              node,
              visitor(node.openingElement) as ts.JsxOpeningElement,
              [factory.createJsxText(toBase64(translation))],
              visitor(node.closingElement) as ts.JsxClosingElement
            );
          } else {
            return factory.updateJsxElement(
              node,
              visitor(node.openingElement) as ts.JsxOpeningElement,
              [
                factory.createJsxExpression(
                  undefined,
                  factory.createArrayLiteralExpression(
                    translation.map((t) =>
                      factory.createStringLiteral(toBase64(t))
                    )
                  )
                ),
              ],
              visitor(node.closingElement) as ts.JsxClosingElement
            );
          }
        }
      }

      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(sourceFile, visitor);
  };
