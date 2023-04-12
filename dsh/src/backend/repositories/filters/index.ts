import * as aql from 'arangojs/aql';
import { MaybeArray } from '../../utils';
import { FilterOperator } from './operators';

export abstract class Filter<Collection> {
  // This is in order to fake this being a nominal type.
  // SchoolyearIdFilter should not be assignable to LevelIdFilter despite both *-IdFilter being the same structure.
  private readonly _collection: Collection | undefined;

  abstract apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter?: number
  ): aql.GeneratedAqlQuery;

  protected getFreeVariableName(counter: number): aql.AqlLiteral {
    return aql.literal(`__filter${counter}`);
  }
}

export abstract class ScalarFilter<
  Collection,
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean | null>
  >
> extends Filter<Collection> {
  protected abstract readonly propertyName: string;

  constructor(
    private readonly filterOperator:
      | FilterOperatorType
      | ((variableName: aql.AqlLiteral) => FilterOperatorType)
  ) {
    super();
  }

  apply(variableName: aql.AqlLiteral): aql.GeneratedAqlQuery {
    const filterOperator =
      typeof this.filterOperator === 'function'
        ? this.filterOperator(variableName)
        : this.filterOperator;

    return aql.aql`${variableName}.${aql.literal(
      this.propertyName
    )} ${filterOperator.apply()}`;
  }
}

export abstract class RelationalFilter<
  Collection,
  RelatedFilter extends Filter<unknown>
> extends Filter<Collection> {
  protected abstract readonly propertyName: string;
  protected abstract readonly relatedCollection: string;
  protected readonly nullable: boolean = false;

  constructor(private readonly relatedFilter: RelatedFilter) {
    super();
  }

  apply(
    variableName: aql.AqlLiteral,
    freeVariableNameCounter = 0
  ): aql.GeneratedAqlQuery {
    const nextVariableName = this.getFreeVariableName(freeVariableNameCounter);

    const propertyNameLiteral = aql.literal(this.propertyName);

    return aql.aql`
      ${
        this.nullable
          ? aql.aql`(${variableName}.${propertyNameLiteral} != null && `
          : undefined
      }
      ${variableName}.${propertyNameLiteral} IN (
        FOR ${nextVariableName} IN ${aql.literal(this.relatedCollection)}
          FILTER ${this.relatedFilter.apply(
            nextVariableName,
            freeVariableNameCounter + 1
          )}
          RETURN ${nextVariableName}._key
      )
      ${this.nullable ? aql.aql`)` : undefined}
    `;
  }
}

export class AndFilter<BaseWithId> extends Filter<BaseWithId> {
  private readonly filters: (Filter<BaseWithId> | null)[];

  constructor(...filters: (Filter<BaseWithId> | null)[]) {
    super();

    if (!filters.length) {
      throw new Error('AndFilter must have at least one filter.');
    }

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

    if (!filters.length) {
      throw new Error('OrFilter must have at least one filter.');
    }

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
