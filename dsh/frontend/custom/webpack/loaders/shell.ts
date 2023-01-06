import ts from 'typescript';
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
for (const [dir, moduleName] of yieldModules()) {
  const pkg = readJsonSync(`${dir}/package.json`);

  if (typeof pkg.dsh.bodies === 'object') {
    for (const [scope, names] of Object.entries(pkg.dsh.bodies)) {
      if (!Array.isArray(names))
        throw new Error(`Invalid bodies entry for ${pkg.name}`);

      for (const name of names) {
        const key = `${scope}/${name}`;
        if (!packageBodies.has(key)) packageBodies.set(key, []);

        packageBodies.get(key)!.push(moduleName);
      }
    }
  }
}

export const transformerFactory: DshTransformerFactory =
  () => (context) => (sourceFile) => {
    const { factory } = context;
    const imports: ts.ImportDeclaration[] = [];

    function visitor(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node)) {
        const {
          expression,
          arguments: [arg, dynamicImportArg],
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

            if (
              dynamicImportArg &&
              dynamicImportArg.kind !== ts.SyntaxKind.TrueKeyword &&
              dynamicImportArg.kind !== ts.SyntaxKind.FalseKeyword
            ) {
              throw new Error('Invalid dynamic import argument');
            }

            if (dynamicImportArg?.kind === ts.SyntaxKind.TrueKeyword) {
              const arrayLiteralExpression =
                factory.createArrayLiteralExpression(
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
            } else {
              const importStatements = foundBodies.map((bod) =>
                factory.createImportDeclaration(
                  [],
                  factory.createImportClause(
                    false,
                    factory.createUniqueName('dsh_generated_shell_import'),
                    undefined
                  ),
                  factory.createStringLiteral(`${bod}/bodies/${key}`),
                  undefined
                )
              );

              const arrayLiteralExpression =
                factory.createArrayLiteralExpression(
                  importStatements.map((imp) => imp.importClause!.name!)
                );

              imports.push(...importStatements);

              return node.typeArguments?.length
                ? factory.createAsExpression(
                    arrayLiteralExpression,
                    node.typeArguments[0]
                  )
                : arrayLiteralExpression;
            }
          }
        }
      }

      return ts.visitEachChild(node, visitor, context);
    }

    const sf = ts.visitNode(sourceFile, visitor);

    return factory.updateSourceFile(sf, [
      ...imports,
      ...sf.statements,
    ]);
  };
