import * as aql from 'arangojs/aql';
import { MaybeArray } from '../../../utils';

export abstract class FilterOperator<
  Value extends MaybeArray<string | number | boolean>
> {
  protected abstract readonly operator: string;

  constructor(private readonly value: Value) {}

  apply(): aql.GeneratedAqlQuery {
    return aql.aql`${aql.literal(this.operator)} ${this.value}`;
  }
}

export class EqFilterOperator<
  Value extends string | number | boolean
> extends FilterOperator<Value> {
  protected readonly operator = '==';
}

export class NeqFilterOperator<
  Value extends string | number | boolean
> extends FilterOperator<Value> {
  protected readonly operator = '!=';
}

export class GtFilterOperator<
  Value extends number
> extends FilterOperator<Value> {
  protected readonly operator = '>';
}

export class GteFilterOperator<
  Value extends number
> extends FilterOperator<Value> {
  protected readonly operator = '>=';
}

export class LtFilterOperator<
  Value extends number
> extends FilterOperator<Value> {
  protected readonly operator = '<';
}

export class LteFilterOperator<
  Value extends number
> extends FilterOperator<Value> {
  protected readonly operator = '<=';
}

export class InFilterOperator<
  Value extends string | number | boolean
> extends FilterOperator<Value[]> {
  protected readonly operator = 'IN';
}

export class NinFilterOperator<
  Value extends string | number | boolean
> extends FilterOperator<Value[]> {
  protected readonly operator = 'NOT IN';
}

export type IDFilterOperator =
  | EqFilterOperator<string>
  | NeqFilterOperator<string>
  | InFilterOperator<string>
  | NinFilterOperator<string>;

export type StringFilterOperator =
  | EqFilterOperator<string>
  | NeqFilterOperator<string>
  | InFilterOperator<string>
  | NinFilterOperator<string>;

export type NumberFilterOperator =
  | EqFilterOperator<number>
  | NeqFilterOperator<number>
  | GtFilterOperator<number>
  | GteFilterOperator<number>
  | LtFilterOperator<number>
  | LteFilterOperator<number>
  | InFilterOperator<number>
  | NinFilterOperator<number>;

export type BooleanFilterOperator =
  | EqFilterOperator<boolean>
  | NeqFilterOperator<boolean>;
