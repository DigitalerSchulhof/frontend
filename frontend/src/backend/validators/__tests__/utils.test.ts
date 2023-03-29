import {
  AggregatedInputValidationError,
  InputValidationError,
  aggregateValidationErrors,
} from '../utils';

describe('aggregateValidationErrors()', () => {
  it('returns nothing if all promises are fulfilled', async () => {
    await expect(
      aggregateValidationErrors([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
    ).resolves.toBeUndefined();
  });

  it('returns an AggregatedInputValidationError if at least one promise is rejected with an InputValidationError', async () => {
    await expect(
      aggregateValidationErrors([
        Promise.resolve(1),
        Promise.reject(new InputValidationError('test')),
        Promise.resolve(3),
      ])
    ).resolves.toEqual(expect.any(AggregatedInputValidationError));
  });

  it("maintains the order of the errors in the AggregatedInputValidationError's errors array", async () => {
    const errors = [
      new InputValidationError('test1'),
      new InputValidationError('test2'),
      new InputValidationError('test3'),
    ];

    await expect(
      aggregateValidationErrors([
        Promise.resolve(),
        Promise.reject(errors[0]),
        Promise.resolve(),
        Promise.reject(errors[1]),
        Promise.reject(errors[2]),
      ])
    ).resolves.toEqual(
      expect.objectContaining({
        errors,
      })
    );
  });

  it("throws if at least one promise is rejected with something that isn't an InputValidationError", async () => {
    await expect(
      aggregateValidationErrors([
        Promise.resolve(1),
        Promise.reject(new Error('test')),
        Promise.resolve(3),
      ])
    ).rejects.toThrow(expect.any(Error));
  });
});
