import { AggregateClientError, ClientError, MaybePromise } from '#/utils';
import { isPromiseRejectedResult } from '../utils';

export class InputValidationError extends ClientError {}

export class AggregatedInputValidationError extends AggregateClientError {}

export async function aggregateValidationErrors(
  promises: (MaybePromise<unknown> | null)[]
): Promise<void | never> {
  const results = await Promise.allSettled(promises);

  const errors = results.filter(isPromiseRejectedResult);

  aggregateValidationErrorsReasons(errors);
}

function aggregateValidationErrorsReasons(
  reasons: PromiseRejectedResult[]
): void | never {
  const errors = reasons.reduce<InputValidationError[]>((arr, acc) => {
    if (acc.reason instanceof InputValidationError) {
      arr.push(acc.reason);
    } else if (acc.reason instanceof AggregatedInputValidationError) {
      arr.push(...acc.reason.errors);
    } else {
      throw acc.reason;
    }

    return arr;
  }, []);

  if (errors.length > 0) {
    throw new AggregatedInputValidationError(errors);
  }
}
