import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import type { DshTransformerFactory } from '.';
import {
  findNearestPackageJson,
  readJsonSync,
  yieldModules,
} from '../../utils';

/**
 * @key package name
 * @value provided bodies
 */
const packageBodies: Map<string, string[]> = new Map();

// Collect all installed bodies
for (const dir of yieldModules()) {
  const pkg = readJsonSync(`${dir}/package.json`);

  if (typeof pkg.dsh.bodies === 'object') {
    for (const [scope, names] of Object.entries(pkg.dsh.bodies)) {
      if (!Array.isArray(names))
        throw new Error(`Invalid bodies entry for ${pkg.name}`);

      for (const name of names) {
        const key = `${scope}/${name}`;
        if (!packageBodies.has(key)) packageBodies.set(key, []);

        const splitDir = dir.split('/');
        let modulePath: string[] = [];

        for (let i = splitDir.length - 3; i >= 0; i--) {
          const partialDir = splitDir.slice(0, i);
          if (fs.existsSync(path.join(partialDir.join("/"), 'package.json'))) {
            if (
              readJsonSync(path.join(partialDir.join("/"), 'package.json')).name ===
              '@dsh/frontend'
            ) {
              break;
            }
          }
          modulePath.push(splitDir[i]);
        }

        modulePath = modulePath.reverse();

        // For a trailing slash
        if (modulePath.length) modulePath.push("");

        packageBodies.get(key)!.push(`${modulePath.join("/")}${pkg.name}`);
      }
    }
  }
}

export const transformerFactory: DshTransformerFactory =
  () => (context) => (sourceFile) => {
    const { factory } = context;

    function visitor(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node)) {
        const {
          expression,
          arguments: [arg],
        } = node;
        if (ts.isIdentifier(expression) && expression.text === 'getShell') {
          if (ts.isStringLiteral(arg)) {
            const { text: shellName } = arg;
            const packageName = readJsonSync(
              findNearestPackageJson(sourceFile.fileName)
            ).name;

            const key = `${packageName}/${shellName}`;

            let foundBodies: readonly string[];

            if (packageBodies.has(key)) {
              foundBodies = packageBodies.get(key)!;
            } else {
              foundBodies = [];
            }

            const arrayLiteralExpression = factory.createArrayLiteralExpression(
              foundBodies.map((bod) =>
                factory.createPropertyAccessExpression(
                  factory.createCallExpression(
                    factory.createIdentifier('require'),
                    undefined,
                    [factory.createStringLiteral(`${bod}/bodies/${key}`)]
                  ),
                  factory.createIdentifier('default')
                )
              )
            );

            return node.typeArguments?.length
              ? factory.createAsExpression(
                  arrayLiteralExpression,
                  node.typeArguments[0]
                )
              : arrayLiteralExpression;
          }
        }
      }

      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(sourceFile, visitor);
  };
