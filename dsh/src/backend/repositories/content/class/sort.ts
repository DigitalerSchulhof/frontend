import { Sort } from '../../sort';

export abstract class ClassSort extends Sort<'class'> {}

export class ClassIdSort extends ClassSort {
  protected readonly propertyName = '_key';
}

export class ClassNameSort extends ClassSort {
  protected readonly propertyName = 'name';
}

export class ClassLevelIdSort extends ClassSort {
  protected readonly propertyName = 'levelId';
}
