import * as fs from 'fs';
import * as path from 'path';

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
 * Synchronously reads a file as json.
 */
export function readJsonSync<T = any>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
