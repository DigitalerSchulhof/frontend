export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const DEFAULT_LOCALE = 'de-DE';

export function flattenObject(obj: unknown, joiner = '_'): object {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('Expected an object');
  }

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

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ErrorWithPayload extends Error {
  constructor(
    message: string,
    readonly data?: Record<string, unknown>
  ) {
    super(message);
  }
}

export function formatName({
  firstname,
  lastname,
}: {
  firstname: string;
  lastname: string;
}) {
  return `${firstname} ${lastname}`;
}
