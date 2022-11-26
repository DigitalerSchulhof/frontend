import * as path from "path";
import * as fs from "fs";
import type { LoaderDefinitionFunction } from "webpack";

const USE_SHELL_REGEX = /\WuseShell(?:<\w*>)\(["']([a-z-]+)["']\)/g;

const bodies: Map<string, string[]> = new Map();

// Collect all installed bodies
for (const dir of yieldModules()) {
  const pkg = JSON.parse(fs.readFileSync(`${dir}/package.json`, "utf8"));

  if (typeof pkg.bodies === "object") {
    for (const [scope, names] of Object.entries(pkg.bodies)) {
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
const loader: LoaderDefinitionFunction = async function (source) {
  const matches = source.matchAll(USE_SHELL_REGEX);

  if (!matches) return source;

  const packageName: string = await new Promise<{ name: string }>((resolve) =>
    this.fs.readJson!(`${this.rootContext}/package.json`, (_, json) =>
      resolve(json)
    )
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
      source.substring(0, match.index) +
      `[${foundBodies.map(
        (bod) => `require(\"${bod}/bodies/${key}\").default`
      )}]` +
      source.substring(match.index! + stringMatch.length);
  }

  return source;
};

export default loader;

/**
 * Note: yields absolute paths
 */
function* yieldModules(
  dir: string = path.resolve(__dirname, "../node_modules")
): Generator<string> {
  for (const entity of fs.readdirSync(dir)) {
    if (entity === ".bin") continue;

    if (entity.startsWith("@")) {
      yield* yieldModules(path.join(dir, entity));
    } else {
      yield path.join(dir, entity);
    }
  }
}
