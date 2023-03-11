import * as aql from 'arangojs/aql';
import { Level } from '.';
import { Filter } from '../../filters';
import { IDFilterOperator } from '../../filters/operators/id';
import { StringFilterOperator } from '../../filters/operators/string';
import { SchoolyearFilter } from '../schoolyear/filters';

export abstract class LevelFilter extends Filter<Level> {}

export class LevelIdFilter extends LevelFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class LevelNameFilter extends LevelFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}.name ${this.filterOperator.apply()}`;
  }
}

export class LevelSchoolyearIdFilter extends LevelFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}.schoolyearId ${this.filterOperator.apply()}`;
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
      FILTER ${variableName}.schoolyearId IN (
        FOR ${nextVariableName} IN schoolyears
          ${this.schoolyearFilter.apply(
            nextVariableName,
            freeVariableNameCounter + 1
          )}
          RETURN ${nextVariableName}._key
      )
    `;
  }
}
