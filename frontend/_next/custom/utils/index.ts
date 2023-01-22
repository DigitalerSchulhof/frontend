import fs from 'fs';
import JSON5 from 'json5';
import path from 'path';

export const __root = path.resolve(__dirname, '../../../..');
export const __frontend = path.resolve(__root, 'frontend');
export const __src = path.resolve(__frontend, 'src');
export const __next = path.resolve(__frontend, '_next');

/**
 * Synchronously reads a file as json.
 */
export function readJsonSync<T = any>(file: string): T {
  return JSON5.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Asynchronously reads a file as json.
 */
export async function readJson<T = any>(file: string): Promise<T> {
  return JSON5.parse(await fs.promises.readFile(file, 'utf8'));
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
