import { isPromiseRejectedResult } from '@utils';

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

export function aggregateValidationErrors(
  promises: PromiseSettledResult<unknown>[]
): void | AggregatedInputValidationError {
  const errors = promises.reduce<unknown[]>((arr, acc) => {
    if (isPromiseRejectedResult(acc)) arr.push(acc.reason);

    return arr;
  }, []);

  aggregateValidationErrorsReasons(errors);
}

function aggregateValidationErrorsReasons(
  reasons: unknown[]
): void | AggregatedInputValidationError {
  const errors = reasons.reduce<InputValidationError[]>((arr, acc) => {
    if (acc instanceof InputValidationError) {
      arr.push(acc);
    } else {
      throw acc;
    }

    return arr;
  }, []);

  if (errors.length > 0) {
    return new AggregatedInputValidationError(errors);
  }
}
