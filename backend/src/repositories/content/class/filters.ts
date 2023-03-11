import * as aql from 'arangojs/aql';
import { Class } from '.';
import { Filter } from '../../filters';
import { IDFilterOperator } from '../../filters/operators/id';
import { StringFilterOperator } from '../../filters/operators/string';
import { LevelFilter } from '../level/filters';

export abstract class ClassFilter extends Filter<Class> {}

export class ClassIdFilter extends ClassFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class ClassNameFilter extends ClassFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}.name ${this.filterOperator.apply()}`;
  }
}

export class ClassLevelIdFilter extends ClassFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}.levelId ${this.filterOperator.apply()}`;
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
      FILTER ${variableName}.levelId IN (
        FOR ${nextVariableName} IN levels
          ${this.levelFilter.apply(
            nextVariableName,
            freeVariableNameCounter + 1
          )}
          RETURN ${nextVariableName}._key
      )
    `;
  }
}
