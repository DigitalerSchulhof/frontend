import * as aql from 'arangojs/aql';
import { Course } from '.';
import { Filter } from '../../filters';
import { IDFilterOperator } from '../../filters/operators/id';
import { StringFilterOperator } from '../../filters/operators/string';
import { ClassFilter } from '../class/filters';

export abstract class CourseFilter extends Filter<Course> {}

export class CourseIdFilter extends CourseFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}._key ${this.filterOperator.apply()}`;
  }
}

export class CourseNameFilter extends CourseFilter {
  constructor(private readonly filterOperator: StringFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}.name ${this.filterOperator.apply()}`;
  }
}

export class CourseClassIdFilter extends CourseFilter {
  constructor(private readonly filterOperator: IDFilterOperator) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`FILTER ${variableName}.classId ${this.filterOperator.apply()}`;
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
      FILTER ${variableName}.classId IN (
        FOR ${nextVariableName} IN classes
          ${this.classFilter.apply(
            nextVariableName,
            freeVariableNameCounter + 1
          )}
          RETURN ${nextVariableName}._key
      )
    `;
  }
}
