import { Sort } from '../../sort';

export abstract class PersonSort extends Sort<'person'> {}

export class PersonIdSort extends PersonSort {
  protected readonly propertyName = '_key';
}

export class PersonFirstnameSort extends PersonSort {
  protected readonly propertyName = 'firstname';
}

export class PersonLastnameSort extends PersonSort {
  protected readonly propertyName = 'lastname';
}

export class PersonTypeSort extends PersonSort {
  protected readonly propertyName = 'type';
}

export class PersonGenderSort extends PersonSort {
  protected readonly propertyName = 'gender';
}

export class PersonTeacherCodeSort extends PersonSort {
  protected readonly propertyName = 'teacherCode';
}
