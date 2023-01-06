/*
 * Stolen from https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/plugins/jsconfig-paths-plugin.ts and adapted for multi-package support
 */

import path from 'path';
import webpack from 'webpack';
import { readJsonSync, yieldModules } from '../../../utils';
import fs from 'fs';

export interface Pattern {
  prefix: string;
  suffix: string;
}

const asterisk = 0x2a;

export function hasZeroOrOneAsteriskCharacter(str: string): boolean {
  let seenAsterisk = false;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === asterisk) {
      if (!seenAsterisk) {
        seenAsterisk = true;
      } else {
        // have already seen asterisk
        return false;
      }
    }
  }
  return true;
}

/**
 * Determines whether a path starts with a relative path component (i.e. `.` or `..`).
 */
export function pathIsRelative(testPath: string): boolean {
  return /^\.\.?($|[\\/])/.test(testPath);
}

export function tryParsePattern(pattern: string): Pattern | undefined {
  // This should be verified outside of here and a proper error thrown.
  const indexOfStar = pattern.indexOf('*');
  return indexOfStar === -1
    ? undefined
    : {
        prefix: pattern.slice(0, indexOfStar),
        suffix: pattern.slice(indexOfStar + 1),
      };
}

function isPatternMatch({ prefix, suffix }: Pattern, candidate: string) {
  return (
    candidate.length >= prefix.length + suffix.length &&
    candidate.startsWith(prefix) &&
    candidate.endsWith(suffix)
  );
}

/** Return the object corresponding to the best pattern to match `candidate`. */
export function findBestPatternMatch<T>(
  values: readonly T[],
  getPattern: (value: T) => Pattern,
  candidate: string
): T | undefined {
  let matchedValue: T | undefined;
  // use length of prefix as betterness criteria
  let longestMatchPrefixLength = -1;

  for (const v of values) {
    const pattern = getPattern(v);
    if (
      isPatternMatch(pattern, candidate) &&
      pattern.prefix.length > longestMatchPrefixLength
    ) {
      longestMatchPrefixLength = pattern.prefix.length;
      matchedValue = v;
    }
  }

  return matchedValue;
}

/**
 * patternStrings contains both pattern strings (containing "*") and regular strings.
 * Return an exact match if possible, or a pattern match, or undefined.
 * (These are verified by verifyCompilerOptions to have 0 or 1 "*" characters.)
 */
export function matchPatternOrExact(
  patternStrings: readonly string[],
  candidate: string
): string | Pattern | undefined {
  const patterns: Pattern[] = [];
  for (const patternString of patternStrings) {
    if (!hasZeroOrOneAsteriskCharacter(patternString)) continue;
    const pattern = tryParsePattern(patternString);
    if (pattern) {
      patterns.push(pattern);
    } else if (patternString === candidate) {
      // pattern was matched as is - no need to search further
      return patternString;
    }
  }

  return findBestPatternMatch(patterns, (_) => _, candidate);
}

/**
 * Tests whether a value is string
 */
export function isString(text: unknown): text is string {
  return typeof text === 'string';
}

/**
 * Given that candidate matches pattern, returns the text matching the '*'.
 * E.g.: matchedText(tryParsePattern("foo*baz"), "foobarbaz") === "bar"
 */
export function matchedText(pattern: Pattern, candidate: string): string {
  return candidate.substring(
    pattern.prefix.length,
    candidate.length - pattern.suffix.length
  );
}

export function patternText({ prefix, suffix }: Pattern): string {
  return `${prefix}*${suffix}`;
}

/**
 * Calls the iterator function for each entry of the array
 * until the first result or error is reached
 */
function forEachBail<TEntry>(
  array: TEntry[],
  iterator: (
    entry: TEntry,
    entryCallback: (err?: any, result?: any) => void
  ) => void,
  callback: (err?: any, result?: any) => void
): void {
  if (array.length === 0) return callback();

  let i = 0;
  const next = () => {
    let loop: boolean | undefined = undefined;
    iterator(array[i++], (err, result) => {
      if (err || result !== undefined || i >= array.length) {
        return callback(err, result);
      }
      if (loop === false) while (next());
      loop = true;
    });
    if (!loop) loop = false;
    return loop;
  };
  while (next());
}

type Paths = { [match: string]: string[] };

const moduleAliases = new Map<string, [string, Paths]>();

for (const [dir] of yieldModules()) {
  const pkg = readJsonSync(`${dir}/package.json`);

  if (!fs.existsSync(`${dir}/tsconfig.json`)) continue;
  const tsconfig = readJsonSync(`${dir}/tsconfig.json`);

  if (!tsconfig.compilerOptions) continue;
  if (!tsconfig.compilerOptions.paths) continue;

  const resolvedBaseUrl = path.resolve(
    dir,
    tsconfig.compilerOptions.baseUrl || ''
  );

  moduleAliases.set(pkg.name, [
    resolvedBaseUrl,
    tsconfig.compilerOptions.paths,
  ]);
}

export class PathsPlugin implements webpack.ResolvePluginInstance {
  pathsPlugin = true;

  apply(resolver: webpack.Resolver) {
    const target = resolver.ensureHook('resolve');
    resolver
      .getHook('described-resolve')
      .tapAsync('PathsPlugin', (request: any, resolveContext, callback) => {
        if (!moduleAliases.has(request.descriptionFileData?.name)) {
          return callback();
        }

        const [baseUrl, paths] = moduleAliases.get(
          request.descriptionFileData?.name
        )!;
        const pathsKeys = Object.keys(paths);

        // If no aliases are added bail out
        if (pathsKeys.length === 0) {
          return callback();
        }

        const moduleName = request.request;

        if (
          path.posix.isAbsolute(moduleName) ||
          (process.platform === 'win32' && path.win32.isAbsolute(moduleName))
        ) {
          return callback();
        }

        if (pathIsRelative(moduleName)) {
          return callback();
        }

        // log('starting to resolve request %s', moduleName)

        // If the module name does not match any of the patterns in `paths` we hand off resolving to webpack
        const matchedPattern = matchPatternOrExact(pathsKeys, moduleName);
        if (!matchedPattern) {
          return callback();
        }

        const matchedStar = isString(matchedPattern)
          ? undefined
          : matchedText(matchedPattern, moduleName);
        const matchedPatternText = isString(matchedPattern)
          ? matchedPattern
          : patternText(matchedPattern);

        let triedPaths = [];

        forEachBail(
          paths[matchedPatternText],
          (subst, pathCallback) => {
            const curPath = matchedStar
              ? subst.replace('*', matchedStar)
              : subst;
            // Ensure .d.ts is not matched
            if (curPath.endsWith('.d.ts')) {
              // try next path candidate
              return pathCallback();
            }
            const candidate = path.join(baseUrl, curPath);
            const obj = Object.assign({}, request, {
              request: candidate,
            });

            resolver.doResolve(
              target,
              obj,
              `Aliased with tsconfig.json or jsconfig.json ${matchedPatternText} to ${candidate}`,
              resolveContext,
              (resolverErr: any, resolverResult: any) => {
                if (resolverErr || resolverResult === undefined) {
                  triedPaths.push(candidate);
                  // try next path candidate
                  return pathCallback();
                }
                return pathCallback(resolverErr, resolverResult);
              }
            );
          },
          callback
        );
      });
  }
}
