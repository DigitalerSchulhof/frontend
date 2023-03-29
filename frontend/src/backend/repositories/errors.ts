export const ERROR_ARANGO_CONFLICT = 1200;

export class RevMismatchError extends Error {
  constructor() {
    super('Revision mismatch');
  }
}

export const ERROR_ARANGO_DOCUMENT_NOT_FOUND = 1202;

export class IdNotFoundError extends Error {
  constructor() {
    super('Id not found');
  }
}
