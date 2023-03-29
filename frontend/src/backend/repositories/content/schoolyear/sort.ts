import { Sort } from '../../sort';

export abstract class SchoolyearSort extends Sort<'schoolyear'> {}

export class SchoolyearIdSort extends SchoolyearSort {
  protected readonly propertyName = '_key';
}

export class SchoolyearNameSort extends SchoolyearSort {
  protected readonly propertyName = 'name';
}

export class SchoolyearStartSort extends SchoolyearSort {
  protected readonly propertyName = 'start';
}

export class SchoolyearEndSort extends SchoolyearSort {
  protected readonly propertyName = 'end';
}
