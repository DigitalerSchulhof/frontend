import * as aql from 'arangojs/aql';
import { Course } from '.';
import { Sort } from '../../sort';

export abstract class CourseSort extends Sort<Course> {}

export class CourseIdSort extends CourseSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}._key ${CourseIdSort.sortDirectionMap[this.direction]}
    `;
  }
}

export class CourseNameSort extends CourseSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.name ${CourseIdSort.sortDirectionMap[this.direction]}
    `;
  }
}

export class CourseClassIdSort extends CourseSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.classId ${
      CourseIdSort.sortDirectionMap[this.direction]
    }
    `;
  }
}
