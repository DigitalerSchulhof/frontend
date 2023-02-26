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

export const CANNOT_CREATE_DUPLICATE_FIELDS = 'CANNOT_CREATE_DUPLICATE_FIELDS';

export const CANNOT_UPDATE_REV_MISMATCH = 'CANNOT_UPDATE_REV_MISMATCH';
export const CANNOT_UPDATE_ID_NOT_FOUND = 'CANNOT_UPDATE_ID_NOT_FOUND';
export const CANNOT_UPDATE_DUPLICATE_FIELDS = 'CANNOT_UPDATE_DUPLICATE_FIELDS';

export const CANNOT_DELETE_REV_MISMATCH = 'CANNOT_DELETE_REV_MISMATCH';
export const CANNOT_DELETE_ID_NOT_FOUND = 'CANNOT_DELETE_ID_NOT_FOUND';

export const NO_PERMISSION = 'NO_PERMISSION';

export class GraphQLCannotCreateDuplicateFieldsError extends TypedGraphQLError {
  constructor(readonly duplicateFields: string[]) {
    super("Can't create!", CANNOT_CREATE_DUPLICATE_FIELDS, {
      extensions: {
        duplicateFields,
      },
    });
  }
}

export class GraphQLCannotUpdateRevMismatchError extends TypedGraphQLError {
  constructor() {
    super("Can't update!", CANNOT_UPDATE_REV_MISMATCH);
  }
}

export class GraphQLCannotUpdateIdNotFoundError extends TypedGraphQLError {
  constructor() {
    super("Can't update!", CANNOT_UPDATE_ID_NOT_FOUND);
  }
}

export class GraphQLCannotUpdateDuplicateFieldsError extends TypedGraphQLError {
  constructor(readonly duplicateFields: string[]) {
    super("Can't update!", CANNOT_UPDATE_DUPLICATE_FIELDS, {
      extensions: {
        duplicateFields,
      },
    });
  }
}

export class GraphQLCannotDeleteRevMismatchError extends TypedGraphQLError {
  constructor() {
    super("Can't delete!", CANNOT_DELETE_REV_MISMATCH);
  }
}

export class GraphQLCannotDeleteIdNotFoundError extends TypedGraphQLError {
  constructor() {
    super("Can't delete!", CANNOT_DELETE_ID_NOT_FOUND);
  }
}

export class GraphQLNoPermissionError extends TypedGraphQLError {
  constructor(permission: string) {
    super(`No permission!`, NO_PERMISSION, {
      extensions: {
        permission,
      },
    });
  }
}
