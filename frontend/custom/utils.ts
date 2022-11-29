import * as path from 'path';
import * as fs from 'fs';

/**
 * Yields all installed node modules
 *
 * Note: yields absolute paths
 */
export function* yieldModules(): Generator<string> {
  yield* yieldModulesWorker(path.resolve(__dirname, '../node_modules'));
}

const blacklist = new Set().add(".bin").add(".pnpm").add(".yarn").add(".modules.yaml");
function* yieldModulesWorker(dir: string): Generator<string> {
  for (const entity of fs.readdirSync(dir)) {
    if (blacklist.has(entity)) continue;


    if (entity[0] === '@') {
      yield* yieldModulesWorker(path.join(dir, entity));
    } else {
      yield path.join(dir, entity);
    }
  }
}

export function readJsonSync<T = any>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export async function readJson<T = any>(file: string): Promise<T> {
  return JSON.parse(await fs.promises.readFile(file, 'utf8'));
}

export async function findNearestPackageJson(file: string): Promise<string> {
  const dir = path.dirname(file);

  if (dir === file) throw new Error('No package.json found');

  const pkg = path.join(dir, 'package.json');

  if (fs.existsSync(pkg)) return pkg;

  return findNearestPackageJson(dir);
}
