import * as aql from 'arangojs/aql';

export abstract class Filter<Collection> {
  // This is in order to fake this being a nominal type.
  // Filter<Schoolyear> should not be assignable to Filter<Course> despite filter itself being the same structure.
  private readonly _collection: Collection | undefined;

  abstract apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter?: number
  ): aql.GeneratedAqlQuery;

  protected getFreeVariableName(counter: number): aql.AqlLiteral {
    return aql.literal(`__filter${counter}`);
  }
}
