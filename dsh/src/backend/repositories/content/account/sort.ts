import { Sort } from '../../sort';

export abstract class AccountSort extends Sort<'account'> {}

export class AccountIdSort extends AccountSort {
  protected readonly propertyName = '_key';
}

export class AccountUsernameSort extends AccountSort {
  protected readonly propertyName = 'username';
}

export class AccountEmailSort extends AccountSort {
  protected readonly propertyName = 'email';
}

export class AccountPersonIdSort extends AccountSort {
  protected readonly propertyName = 'personId';
}

export class AccountLastLoginSort extends AccountSort {
  protected readonly propertyName = 'lastLogin';
}

export class AccountSecondLastLoginSort extends AccountSort {
  protected readonly propertyName = 'secondLastLogin';
}
