import * as aql from 'arangojs/aql';
import { Filter } from '../../filters';
import {
  IDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators/base';
import { LevelFilter } from '../level/filters';

export abstract class ClassFilter extends Filter<'class'> {}

export class ClassIdFilter extends ClassFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class ClassNameFilter extends ClassFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.name ${this.filterOperator.apply()}`;
  }
}

export class ClassLevelIdFilter extends ClassFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.levelId ${this.filterOperator.apply()}`;
  }
}

export class ClassLevelFilter extends ClassFilter {
  constructor(private readonly levelFilter: LevelFilter) {
    super();
  }

  apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter = 0
  ): aql.GeneratedAqlQuery {
    const nextVariableName = this.getFreeVariableName(freeVariableNameCounter);

    return aql.aql`
      ${variableName}.levelId IN (
        FOR ${nextVariableName} IN levels
          FILTER ${this.levelFilter.apply(
            nextVariableName,
            freeVariableNameCounter + 1
          )}
          RETURN ${nextVariableName}._key
      )
    `;
  }
}
