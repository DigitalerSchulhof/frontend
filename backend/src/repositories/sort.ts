import * as aql from 'arangojs/aql';

export enum SortDirection {
  asc,
  desc,
}

export abstract class Sort<Collection> {
  // This is in order to fake this being a nominal type.
  // SchoolyearIdSort should not be assignable to LevelIdSort despite both *-IdSort being the same structure.
  private readonly _collection: Collection | undefined;

  protected abstract readonly propertyName: string;

  constructor(protected readonly direction: SortDirection) {}

  protected static readonly sortDirectionMap = {
    [SortDirection.asc]: aql.literal('ASC'),
    [SortDirection.desc]: aql.literal('DESC'),
  };

  apply(documentName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    return aql.aql`${documentName}.${aql.literal(this.propertyName)} ${
      Sort.sortDirectionMap[this.direction]
    }`;
  }
}
