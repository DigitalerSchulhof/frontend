export const DEFAULT_LOCALE = 'de-DE';

export function isWatchMode(): boolean {
  return process.argv.includes('--watch');
}

export function flattenObject(obj: object, joiner = '_'): object {
  return Object.keys(obj).reduce<object>((acc, key) => {
    // @ts-expect-error -- Object access
    const val = obj[key];

    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const flatObject = flattenObject(val, joiner);
      Object.keys(flatObject).forEach((k) => {
        // @ts-expect-error -- Object access
        acc[`${key}${joiner}${k}`] = flatObject[k];
      });
    } else {
      // @ts-expect-error -- Object access
      acc[key] = val;
    }

    return acc;
  }, {});
}
