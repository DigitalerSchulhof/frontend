import * as aql from 'arangojs/aql';

export abstract class Filter<Collection> {
  // This is in order to fake this being a nominal type.
  // Filter<'schoolyears'> should not be assignable to Filter<'courses'> despite filter itself being the same structure (ie. empty).
  private readonly _collection: Collection | undefined;

  abstract apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter?: number
  ): aql.GeneratedAqlQuery;

  protected getFreeVariableName(counter: number): aql.AqlLiteral {
    return aql.literal(`__filter${counter}`);
  }
}

export class AndFilter<BaseWithId> extends Filter<BaseWithId> {
  private readonly filters: (Filter<BaseWithId> | null)[];

  constructor(...filters: (Filter<BaseWithId> | null)[]) {
    super();

    this.filters = filters;
  }

  apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter = 0
  ): aql.GeneratedAqlQuery {
    return aql.aql`(${aql.join(
      this.filters.map((filter) =>
        filter?.apply(variableName, freeVariableNameCounter)
      ),
      ' AND '
    )})`;
  }
}

export class OrFilter<BaseWithId> extends Filter<BaseWithId> {
  private readonly filters: (Filter<BaseWithId> | null)[];

  constructor(...filters: (Filter<BaseWithId> | null)[]) {
    super();

    this.filters = filters;
  }

  apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter = 0
  ): aql.GeneratedAqlQuery {
    return aql.aql`(${aql.join(
      this.filters.map((filter) =>
        filter?.apply(variableName, freeVariableNameCounter)
      ),
      ' OR '
    )})`;
  }
}
