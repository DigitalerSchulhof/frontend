import { Sort } from '../../sort';

export abstract class IdentityTheftSort extends Sort<'identity-thefts'> {}

export class IdentityTheftIdSort extends IdentityTheftSort {
  protected readonly propertyName = '_key';
}

export class IdentityTheftReportedAtSort extends IdentityTheftSort {
  protected readonly propertyName = 'reportedAt';
}
