import { getContext } from '#/auth/action';
import { MaybePromise } from '#/utils';
import { AggregateClientError, ClientError } from '#/utils/server';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { Eny, Parse, Scalar, scalar, v, validate } from 'vality';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace vality {
    interface scalars {
      toggle: Scalar<'toggle', boolean>;
    }
  }
}

v.toggle = scalar('toggle', (val) => {
  if (val === 'on') return true;
  if (val === null) return false;

  return undefined;
});

export type WrappedActionResult<R> =
  | { code: 'OK'; data: R }
  | { code: 'NOT_OK'; data: readonly { code: string }[] };

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

    for (let i = 0; i < argSchemas.length; i++) {
      const validated = validate(argSchemas[i], args[i]);

      if (!validated.valid) {
        return {
          code: 'NOT_OK',
          data: [
            {
              code: 'INTERNAL_ERROR',
            },
          ],
        };
      }

      validatedArgs[i] = validated.data;
    }

    try {
      return {
        code: 'OK',
        data: await fn(...validatedArgs),
      };
    } catch (err) {
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

      if (isRedirectError(err)) {
        throw err;
      }

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

export function wrapFormAction<Schema extends Record<string, Eny>, R>(
  schema: Schema,
  fn: (data: Parse<Schema>) => MaybePromise<R>
): (formData: FormData) => Promise<WrappedActionResult<R>> {
  return (formData: FormData) => {
    const data = {} as Parse<Schema>;
    for (const key of Object.keys(schema)) {
      // @ts-expect-error -- Object access
      data[key] = formData.get(key);
    }

    return wrapAction([schema], fn)(data);
  };
}

export class InvalidInputError extends ClientError {
  public constructor() {
    super('INVALID_INPUT');
  }
}
