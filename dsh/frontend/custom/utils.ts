import * as path from 'path';
import * as fs from 'fs';

export const LOCALE = 'de-DE';

/**
 * Yields all installed dsh node modules.
 *
 * Note: Yields absolute paths.
 */
export function* yieldModules(): Generator<[string, string]> {
  seenModules.clear();
  yield* yieldModulesWorker(path.resolve(__dirname, '../../node_modules'), []);
}

const seenModules = new Set<string>();
const blacklist = new Set(['.bin', '.pnpm', '.yarn', '.modules.yaml']);
function* yieldModulesWorker(
  dir: string,
  modulePath: string[]
): Generator<[string, string]> {
  for (const entity of fs.readdirSync(dir)) {
    if (blacklist.has(entity)) continue;

    if (entity[0] === '@') {
      yield* yieldModulesWorker(path.join(dir, entity), [
        ...modulePath,
        entity,
      ]);
    } else {
      if (fs.existsSync(path.join(dir, entity, 'package.json'))) {
        const pkg = readJsonSync(path.join(dir, entity, 'package.json'));
        if (seenModules.has(pkg.name)) {
          continue;
        } else {
          seenModules.add(pkg.name);
        }
        if ('dsh' in pkg) {
          yield [path.join(dir, entity), path.join(...modulePath, entity)];
        }
        if (fs.existsSync(path.join(dir, entity, 'node_modules'))) {
          yield* yieldModulesWorker(path.join(dir, entity, 'node_modules'), [
            ...modulePath,
            entity,
            'node_modules',
          ]);
        }
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
  if (!fs.existsSync(dir)) return;

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

export function flattenObject(obj: any, joiner = '_'): any {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const val = obj[key];
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        const flatObject = flattenObject(val, joiner);
        Object.keys(flatObject).forEach((k) => {
          acc[`${key}${joiner}${k}`] = flatObject[k];
        });
      } else {
        acc[key] = val;
      }

      return acc;
    }, {});
  }
  return obj;
}

export function toBase64(str: string): string {
  return Buffer.from(str).toString('base64');
}
