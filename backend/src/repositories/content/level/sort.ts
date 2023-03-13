import { Sort } from '../../sort';

export abstract class LevelSort extends Sort<'level'> {}

export class LevelIdSort extends LevelSort {
  protected readonly propertyName = '_key';
}

export class LevelNameSort extends LevelSort {
  protected readonly propertyName = 'name';
}

export class LevelSchoolyearIdSort extends LevelSort {
  protected readonly propertyName = 'schoolyearId';
}
