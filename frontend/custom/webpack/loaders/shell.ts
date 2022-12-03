import type { LoaderDefinitionFunction } from 'webpack';
import {
  findNearestPackageJson,
  readJsonSync,
  yieldModules,
} from '../../utils';

const GET_SHELL_REGEX = /\bgetShell(?:<\w*>)\(["']([a-z-]+)["']\)/g;

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

        packageBodies.get(key)!.push(pkg.name);
      }
    }
  }
}

const emptyArray: readonly string[] = [];
export const shellLoader: LoaderDefinitionFunction = async function (source) {
  const matches = source.matchAll(GET_SHELL_REGEX);

  if (!matches) return source;

  const packageName = readJsonSync<{ name: string }>(
    findNearestPackageJson(this.resourcePath)
  ).name;

  let offset = 0;

  for (const match of matches) {
    const [stringMatch, shellName] = match;

    const key = `${packageName}/${shellName}`;

    let foundBodies: readonly string[];

    if (packageBodies.has(key)) {
      foundBodies = packageBodies.get(key)!;
    } else {
      foundBodies = emptyArray;
    }

    const replacement = `[${foundBodies.map(
      (bod) => `require(\"${bod}/bodies/${key}\").default`
    )}]`;

    source =
      source.substring(0, match.index!) +
      replacement +
      source.substring(match.index! + 1 + stringMatch.length);

    offset += replacement.length - stringMatch.length;
  }

  return source;
};

export default shellLoader;
