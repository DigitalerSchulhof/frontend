import { Sort } from '../../sort';

export abstract class AccountSort extends Sort<'level'> {}

export class AccountIdSort extends AccountSort {
  protected readonly propertyName = '_key';
}

export class AccountNameSort extends AccountSort {
  protected readonly propertyName = 'name';
}

export class AccountPersonIdSort extends AccountSort {
  protected readonly propertyName = 'personId';
}
