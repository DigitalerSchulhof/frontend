import { Sort } from '../../sort';

export abstract class SessionSort extends Sort<'session'> {}

export class SessionIdSort extends SessionSort {
  protected readonly propertyName = '_key';
}

export class SessionPersonIdSort extends SessionSort {
  protected readonly propertyName = 'personId';
}

export class SessionIatSort extends SessionSort {
  protected readonly propertyName = 'iat';
}
