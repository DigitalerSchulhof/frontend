import { MaybePromise } from '#/utils';
import { isPromiseRejectedResult } from '../utils';

export class InputValidationError extends Error {
  constructor(readonly code: string) {
    super('Invalid input!');
  }
}

export class AggregatedInputValidationError extends Error {
  constructor(readonly errors: InputValidationError[]) {
    super('Invalid input!');
  }
}

export async function aggregateValidationErrors(
  promises: (MaybePromise<unknown> | null)[]
): Promise<void | AggregatedInputValidationError> {
  const results = await Promise.allSettled(promises);

  const errors = results.filter(isPromiseRejectedResult);

  aggregateValidationErrorsReasons(errors);
}

function aggregateValidationErrorsReasons(
  reasons: PromiseRejectedResult[]
): void | AggregatedInputValidationError {
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
