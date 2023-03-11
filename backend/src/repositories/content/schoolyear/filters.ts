import * as aql from 'arangojs/aql';
import { Filter } from '../../filters';
import {
  IDFilterOperator,
  NumberFilterOperator,
  StringFilterOperator,
} from '../../filters/operators/base';

export abstract class SchoolyearFilter extends Filter<'schoolyear'> {}

export class SchoolyearIdFilter extends SchoolyearFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class SchoolyearNameFilter extends SchoolyearFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.name ${this.filterOperator.apply()}`;
  }
}

export class SchoolyearStartFilter extends SchoolyearFilter {
  constructor(private readonly filterOperator: NumberFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.start ${this.filterOperator.apply()}`;
  }
}

export class SchoolyearEndFilter extends SchoolyearFilter {
  constructor(private readonly filterOperator: NumberFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.end ${this.filterOperator.apply()}`;
  }
}
