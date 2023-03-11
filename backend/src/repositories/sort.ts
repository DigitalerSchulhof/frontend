import * as aql from 'arangojs/aql';

export enum SortDirection {
  asc,
  desc,
}

export abstract class Sort<Collection> {
  // This is in order to fake this being a nominal type.
  // Filter<Schoolyear> should not be assignable to Filter<Course> despite filter itself being the same structure.
  private readonly _collection: Collection | undefined;

  constructor(protected readonly direction: SortDirection) {}

  abstract apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery;

  protected static readonly sortDirectionMap = {
    [SortDirection.asc]: aql.literal('ASC'),
    [SortDirection.desc]: aql.literal('DESC'),
  };
}
