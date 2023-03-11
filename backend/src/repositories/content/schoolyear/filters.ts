import * as aql from 'arangojs/aql';
import { Schoolyear } from '.';
import { Filter } from '../../filters';
import { IDFilterOperator } from '../../filters/operators/id';
import { StringFilterOperator } from '../../filters/operators/string';

export abstract class SchoolyearFilter extends Filter<Schoolyear> {}

export class SchoolyearIdFilter extends SchoolyearFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class SchoolyearNameFilter extends SchoolyearFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}.name ${this.filterOperator.apply()}`;
  }
}
