import type { LoaderDefinitionFunction } from 'webpack';
import {
  findNearestPackageJson,
  readJson,
  readJsonSync,
  yieldModules,
} from '../../../utils';

const GET_SHELL_REGEX = /\WgetShell(?:<\w*>)\(["']([a-z-]+)["']\)/g;

const bodies: Map<string, string[]> = new Map();

// Collect all installed bodies
for (const dir of yieldModules()) {
  const pkg = readJsonSync(`${dir}/package.json`);
  if (!pkg.dsh) continue;

  if (typeof pkg.dsh.bodies === 'object') {
    for (const [scope, names] of Object.entries(pkg.dsh.bodies)) {
      if (!Array.isArray(names))
        throw new Error(`Invalid bodies entry for ${pkg.name}`);

      for (const name of names) {
        const key = `${scope}/${name}`;
        if (!bodies.has(key)) bodies.set(key, []);

        bodies.get(key)!.push(pkg.name);
      }
    }
  }
}

const emptyArray: readonly string[] = [];
export const shellLoader: LoaderDefinitionFunction = async function (source) {
  const matches = source.matchAll(GET_SHELL_REGEX);

  if (!matches) return source;

  const packageName = await readJson<{ name: string }>(
    await findNearestPackageJson(this.resourcePath)
  ).then((pkg) => pkg.name);

  for (const match of matches) {
    const [stringMatch, shellName] = match;

    const key = `${packageName}/${shellName}`;

    let foundBodies: readonly string[];

    if (bodies.has(key)) {
      foundBodies = bodies.get(key)!;
    } else {
      foundBodies = emptyArray;
    }

    source =
      source.substring(0, match.index! + 1) +
      `[${foundBodies.map(
        (bod) => `require(\"${bod}/bodies/${key}\").default`
      )}]` +
      source.substring(match.index! + 1 + stringMatch.length);
  }

  return source;
};

export default shellLoader;
