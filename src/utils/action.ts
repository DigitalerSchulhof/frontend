import { getContext } from '#/auth/action';
import type { MaybePromise } from '#/utils';
import {
  AggregateClientError,
  ClientError,
  MalformedInputError,
} from '#/utils/server';
import { isRedirectError } from 'next/dist/client/components/redirect';
import type { Eny, Parse, Scalar } from 'vality';
import { scalar, v, validate } from 'vality';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace vality {
    interface scalars {
      toggle: Scalar<'toggle', boolean>;
    }
  }
}

export type Action<Args extends readonly unknown[], R> = (
  ...args: Args
) => Promise<WrappedActionResult<R>>;

export type SimpleAction = Action<[], void>;

export type WrappedActionResult<R> =
  | { code: 'OK'; data: R }
  | { code: 'NOT_OK'; data: readonly { code: string }[] };

v.toggle = scalar('toggle', (val) => {
  if (val === 'on') return true;
  if (val === null) return false;

  return undefined;
});

export function wrapAction<const A extends readonly Eny[], R = void>(
  argSchemas: A,
  fn: (
    ...args: {
      -readonly [K in keyof A]: Parse<A[K]>;
    }
  ) => MaybePromise<R>
): (
  ...args: {
    [K in keyof A]: Parse<A[K]>;
  }
) => Promise<WrappedActionResult<R>> {
  // This is the boundary. We can't assume anything about the inputs from the client.
  return async (...args: readonly unknown[]) => {
    const validatedArgs = new Array(argSchemas.length) as {
      -readonly [K in keyof A]: Parse<A[K]>;
    };

    try {
      for (let i = 0; i < argSchemas.length; i++) {
        const validated = validate(argSchemas[i], args[i]);

        if (!validated.valid) {
          throw new MalformedInputError();
        }

        validatedArgs[i] = validated.data;
      }

      return {
        code: 'OK',
        // Await so we can try-catch
        data: await fn(...validatedArgs),
      };
    } catch (err) {
      if (isRedirectError(err)) {
        throw err;
      }

      if (err instanceof AggregateClientError) {
        return {
          code: 'NOT_OK',
          data: err.errors.map((e) => ({
            code: e.code,
            ...e.baggage,
          })),
        };
      }

      if (err instanceof ClientError) {
        return {
          code: 'NOT_OK',
          data: [
            {
              code: err.code,
              ...err.baggage,
            },
          ],
        };
      }

      // If we made it this far, it's an internal error

      const context = getContext();
      context.logger.error(err);

      return {
        code: 'NOT_OK',
        data: [
          {
            code: 'INTERNAL_ERROR',
          },
        ],
      };
    }
  };
}

export function wrapFormAction<const Schema extends Record<string, Eny>, R>(
  schema: Schema,
  fn: (data: Parse<Schema>) => MaybePromise<R>
): (formData: FormData) => Promise<WrappedActionResult<R>> {
  return (formData: FormData) => {
    const data = {} as Parse<Schema>;
    for (const key of Object.keys(schema)) {
      // @ts-expect-error -- Object access
      data[key] = formData.get(key);
    }

    console.log(fn.toString());

    return wrapAction([schema], fn)(data);
  };
}

export function assertClient(value: unknown): asserts value {
  if (!value) {
    throw new MalformedInputError();
  }
}
