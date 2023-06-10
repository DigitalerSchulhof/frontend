import { getContext } from '#/auth/action';
import { MaybePromise } from '#/utils';
import { AggregateClientError, ClientError } from '#/utils/server';
import { Eny, Parse, validate } from 'vality';

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

export class InvalidInputError extends ClientError {
  public constructor() {
    super('INVALID_INPUT');
  }
}
