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
          arguments: [arg],
        } = node;
        if (ts.isIdentifier(expression) && expression.text === 't') {
          if (ts.isStringLiteral(arg)) {
            const i18nKey = arg.text;
            const packageName = readJsonSync(
              findNearestPackageJson(sourceFile.fileName)
            ).name;

            const file = getTranslationOrigin(packageName, i18nKey, LOCALE);

            const replacement = toBase64(
              getTranslation(packageName, i18nKey, LOCALE)
            );

            if (file !== null) addDependency(fs.realpathSync(file));

            return factory.updateCallExpression(node, expression, undefined, [
              factory.createStringLiteral(replacement),
            ]);
          }
        }
      }

      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(sourceFile, visitor);
  };
