import * as aql from 'arangojs/aql';
import { Filter } from '../../filters';
import {
  IDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators/base';
import { ClassFilter } from '../class/filters';

export abstract class CourseFilter extends Filter<'course'> {}

export class CourseIdFilter extends CourseFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class CourseNameFilter extends CourseFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.name ${this.filterOperator.apply()}`;
  }
}

export class CourseClassIdFilter extends CourseFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${variableName}.classId ${this.filterOperator.apply()}`;
  }
}

export class CourseClassFilter extends CourseFilter {
  constructor(private readonly classFilter: ClassFilter) {
    super();
  }

  apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter = 0
  ): aql.GeneratedAqlQuery {
    const nextVariableName = this.getFreeVariableName(freeVariableNameCounter);

    return aql.aql`
      ${variableName}.classId IN (
        FOR ${nextVariableName} IN classes
          FILTER ${this.classFilter.apply(
            nextVariableName,
            freeVariableNameCounter + 1
          )}
          RETURN ${nextVariableName}._key
      )
    `;
  }
}
