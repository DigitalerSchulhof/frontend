import * as aql from 'arangojs/aql';
import { Schoolyear } from '.';
import { Sort } from '../../sort';

export abstract class SchoolyearSort extends Sort<Schoolyear> {}

export class SchoolyearIdSort extends SchoolyearSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}._key ${
      SchoolyearIdSort.sortDirectionMap[this.direction]
    }
    `;
  }
}

export class SchoolyearNameSort extends SchoolyearSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.name ${
      SchoolyearIdSort.sortDirectionMap[this.direction]
    }
    `;
  }
}

export class SchoolyearStartSort extends SchoolyearSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.start ${
      SchoolyearIdSort.sortDirectionMap[this.direction]
    }
    `;
  }
}

export class SchoolyearEndSort extends SchoolyearSort {
  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`
      SORT ${documentName}.end ${
      SchoolyearIdSort.sortDirectionMap[this.direction]
    }
    `;
  }
}
