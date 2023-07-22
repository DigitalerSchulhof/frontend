export class ClientError extends Error {
  constructor(
    readonly code: string,
    readonly baggage?: object
  ) {
    super(`Client Error: ${code}`);
  }
}

export class AggregateClientError extends AggregateError {
  constructor(errors: readonly ClientError[]) {
    super(errors, `Client Errors: ${errors.map((e) => e.code).join(', ')}`);
  }
}
