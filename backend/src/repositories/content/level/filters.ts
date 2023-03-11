import * as aql from 'arangojs/aql';
import { Filter } from '../../filters';
import {
  IDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators/base';
import { SchoolyearFilter } from '../schoolyear/filters';

export abstract class LevelFilter extends Filter<'level'> {}

export class LevelIdFilter extends LevelFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class LevelNameFilter extends LevelFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.name ${this.filterOperator.apply()}`;
  }
}

export class LevelSchoolyearIdFilter extends LevelFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.schoolyearId ${this.filterOperator.apply()}`;
  }
}

export class LevelSchoolyearFilter extends LevelFilter {
  constructor(private readonly schoolyearFilter: SchoolyearFilter) {
    super();
  }

  apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter = 0
  ): aql.GeneratedAqlQuery {
    const nextVariableName = this.getFreeVariableName(freeVariableNameCounter);

    return aql.aql`
      ${variableName}.schoolyearId IN (
        FOR ${nextVariableName} IN schoolyears
          FILTER ${this.schoolyearFilter.apply(
            nextVariableName,
            freeVariableNameCounter + 1
          )}
          RETURN ${nextVariableName}._key
      )
    `;
  }
}
