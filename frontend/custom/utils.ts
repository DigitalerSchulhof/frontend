import * as path from 'path';
import * as fs from 'fs';

export const LOCALE = "de-DE";

/**
 * Yields all installed node modules.
 *
 * Note: Yields absolute paths.
 */
export function* yieldModules(): Generator<string> {
  yield* yieldModulesWorker(path.resolve(__dirname, '../node_modules'));
}

const blacklist = new Set(['.bin', '.pnpm', '.yarn', '.modules.yaml']);
function* yieldModulesWorker(dir: string): Generator<string> {
  for (const entity of fs.readdirSync(dir)) {
    if (blacklist.has(entity)) continue;

    if (entity[0] === '@') {
      yield* yieldModulesWorker(path.join(dir, entity));
    } else {
      if (
        fs.existsSync(path.join(dir, entity, 'package.json')) &&
        'dsh' in readJsonSync(path.join(dir, entity, 'package.json'))
      ) {
        yield path.join(dir, entity);
      }
    }
  }
}

/**
 * Recursively yields all files in a directory.
 *
 * Note: Yields absolute paths.
 */
export function* yieldFiles(dir: string): Generator<string> {
  for (const entity of fs.readdirSync(dir)) {
    const entityPath = path.join(dir, entity);
    const stat = fs.statSync(entityPath);
    if (stat.isDirectory()) {
      yield* yieldFiles(entityPath);
    }
    if (stat.isFile()) {
      yield entityPath;
    }
  }
}

/**
 * Synchronously reads a file as json.
 */
export function readJsonSync<T = any>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Asynchronously reads a file as json.
 */
export async function readJson<T = any>(file: string): Promise<T> {
  return JSON.parse(await fs.promises.readFile(file, 'utf8'));
}

/**
 * Finds the nearest package.json file. Throws if none found.
 */
export function findNearestPackageJson(file: string): string {
  const res = findNearestPackageJsonWorker(file);
  if (!res) throw new Error('No package.json found for ' + file);
  return res;
}

export function findNearestPackageJsonWorker(file: string): string | undefined {
  const dir = path.dirname(file);

  if (dir === file) return undefined;

  const pkg = path.join(dir, 'package.json');

  if (fs.existsSync(pkg)) return pkg;

  return findNearestPackageJsonWorker(dir);
}

/**
 * Recursively merges two objects.
 */
export function mergeObjects(
  a: Record<string, any>,
  b: Record<string, any>,
  throwOnConflict = true
) {
  const res = { ...a };

  for (const [key, value] of Object.entries(b)) {
    if (
      key in res &&
      typeof res[key] === 'object' &&
      typeof value === 'object'
    ) {
      res[key] = mergeObjects(res[key], value, throwOnConflict);
    } else {
      if (throwOnConflict && key in res) {
        throw new Error(`Duplicate key ${key}`);
      }
      res[key] = value;
    }
  }

  return res;
}

export function toBase64(str: string): string {
  return Buffer.from(str).toString('base64');
}
