import { GraphQLError, GraphQLErrorOptions } from 'graphql';

export class TypedGraphQLError extends GraphQLError {
  constructor(message: string, code: string, options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        ...options?.extensions,
        code,
      },
    });
  }
}

export const REV_MISMATCH = 'REV_MISMATCH';
export const ID_NOT_FOUND = 'ID_NOT_FOUND';
export const NO_PERMISSION = 'NO_PERMISSION';
export const VALIDATION_ERROR = 'VALIDATION_ERROR';

export class GraphQLRevMismatchError extends TypedGraphQLError {
  constructor(options?: GraphQLErrorOptions) {
    super("Revisions don't match!", REV_MISMATCH, options);
  }
}

export class GraphQLIdNotFoundError extends TypedGraphQLError {
  constructor(options?: GraphQLErrorOptions) {
    super('ID not found!', ID_NOT_FOUND, options);
  }
}

export class GraphQLNoPermissionError extends TypedGraphQLError {
  constructor(permission: string, options?: GraphQLErrorOptions) {
    super(`No permission!`, NO_PERMISSION, {
      ...options,
      extensions: {
        ...options?.extensions,
        permission,
      },
    });
  }
}

export class GraphQLValidationError extends TypedGraphQLError {
  constructor(message: string, code: string, options?: GraphQLErrorOptions) {
    super(message, VALIDATION_ERROR, {
      ...options,
      extensions: {
        ...options?.extensions,
        errorCode: code,
      },
    });
  }
}
