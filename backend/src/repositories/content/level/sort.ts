import * as aql from 'arangojs/aql';
import { Level } from '.';
import { Sort } from '../../sort';

export abstract class LevelSort extends Sort<Level> {}

export class LevelIdSort extends LevelSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}._key ${LevelIdSort.sortDirectionMap[this.direction]}
    `;
  }
}

export class LevelNameSort extends LevelSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.name ${LevelIdSort.sortDirectionMap[this.direction]}
    `;
  }
}

export class LevelSchoolyearIdSort extends LevelSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.schoolyearId ${
      LevelIdSort.sortDirectionMap[this.direction]
    }
    `;
  }
}
