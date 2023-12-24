/**
 * Represents any error that is caused by an invalid request.
 *
 * It's not logged in the server when thrown, instead, the code is forwarded
 * to the client.
 */
export abstract class ClientError extends Error {
  constructor(
    readonly code: string,
    readonly baggage?: object
  ) {
    super(`Client Error: ${code}`);
  }
}

/**
 * This error is used when the client sends a valid request
 * with invalid data.
 *
 * Comparable to HTTP status code 422.
 */
export class InvalidInputError extends ClientError {
  public constructor() {
    super('INVALID_INPUT');
  }
}

/**
 * This error is thrown when we encounter an invalid request:
 * It's not the data that is incorrect, but its structure, so we
 * return it as an "internal error" so that the user doesn't get
 * the "invalid request" dialog, since that would confuse them.
 *
 * Such errors are bugs on our end and should be logged in the client,
 * but not the server.
 *
 * Comparable to HTTP status code 400.
 */
export class MalformedInputError extends ClientError {
  public constructor() {
    super('INTERNAL_ERROR');
  }
}

export class AggregateClientError extends AggregateError {
  constructor(errors: readonly ClientError[]) {
    super(errors, `Client Errors: ${errors.map((e) => e.code).join(', ')}`);
  }
}
