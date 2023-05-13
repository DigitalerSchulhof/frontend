import { getContext } from '#/auth/action';
import { MaybePromise } from '#/utils';
import { AggregateClientError, ClientError } from '#/utils/server';

export type WrappedActionResult<R> =
  | { code: 'OK'; data: R }
  | { code: 'NOT_OK'; data: readonly { code: string }[] };

export function wrapAction<A extends unknown[], R>(
  fn: (...args: A) => MaybePromise<R>
): (...args: A) => Promise<WrappedActionResult<R>> {
  return async (...args: A) => {
    try {
      return {
        code: 'OK',
        data: await fn(...args),
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
