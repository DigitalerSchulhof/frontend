import * as aql from 'arangojs/aql';
import { Class } from '.';
import { Sort } from '../../sort';

export abstract class ClassSort extends Sort<Class> {}

export class ClassIdSort extends ClassSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}._key ${ClassIdSort.sortDirectionMap[this.direction]}
    `;
  }
}

export class ClassNameSort extends ClassSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.name ${ClassIdSort.sortDirectionMap[this.direction]}
    `;
  }
}

export class ClassLevelIdSort extends ClassSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.levelId ${
      ClassIdSort.sortDirectionMap[this.direction]
    }
    `;
  }
}
