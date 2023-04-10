import { Sort } from '../../sort';

export abstract class SessionSort extends Sort<'session'> {}

export class SessionIdSort extends SessionSort {
  protected readonly propertyName = '_key';
}

export class SessionAccountIdSort extends SessionSort {
  protected readonly propertyName = 'accountId';
}

export class SessionIatSort extends SessionSort {
  protected readonly propertyName = 'iat';
}

export class SessionDidShowLastLoginSort extends SessionSort {
  protected readonly propertyName = 'didShowLastLogin';
}
