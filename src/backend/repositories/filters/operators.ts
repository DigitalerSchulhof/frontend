import * as aql from 'arangojs/aql';
import { MaybeArray } from '../../utils';
import { AqlExpression } from '#/backend/repositories/utils';

export abstract class FilterOperator<
  Value extends MaybeArray<string | number | boolean | null>
> {
  protected abstract readonly operator: string;

  constructor(protected readonly value: Value | AqlExpression) {}

  apply(): aql.GeneratedAqlQuery {
    return aql.aql`${aql.literal(this.operator)} ${this.value}`;
    // Unscrew syntax highlighting ``);
  }
}

export abstract class LikeBaseFilterOperator<
  Value extends string
> extends FilterOperator<Value> {
  override apply(): aql.GeneratedAqlQuery {
    return aql.aql`${aql.literal(this.operator)} CONCAT("%", ${
      this.value
    }, "%")`;
    // Unscrew syntax highlighting ``);
  }
}

export class EqFilterOperator<
  Value extends string | number | boolean | null
> extends FilterOperator<Value> {
  protected readonly operator = '==';
}

export class NeqFilterOperator<
  Value extends string | number | boolean | null
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
  Value extends string | number | boolean | null
> extends FilterOperator<Value[]> {
  protected readonly operator = 'IN';
}

export class NinFilterOperator<
  Value extends string | number | boolean | null
> extends FilterOperator<Value[]> {
  protected readonly operator = 'NOT IN';
}

/**
 * Note that unlike the traditional AQL LIKE operator, this matches `%${value}%`.
 */
export class LikeFilterOperator<
  Value extends string
> extends LikeBaseFilterOperator<Value> {
  protected readonly operator = 'LIKE';
}

/**
 * Note that unlike the traditional AQL LIKE operator, this matches `%${value}%`.
 */
export class NLikeFilterOperator<
  Value extends string
> extends LikeBaseFilterOperator<Value> {
  protected readonly operator = 'NOT LIKE';
}

export type IDFilterOperator =
  | EqFilterOperator<string>
  | NeqFilterOperator<string>
  | InFilterOperator<string>
  | NinFilterOperator<string>;

export type NullableIDFilterOperator =
  | EqFilterOperator<string | null>
  | NeqFilterOperator<string | null>
  | InFilterOperator<string | null>
  | NinFilterOperator<string | null>;

export type StringFilterOperator =
  | EqFilterOperator<string>
  | NeqFilterOperator<string>
  | InFilterOperator<string>
  | NinFilterOperator<string>
  | LikeFilterOperator<string>
  | NLikeFilterOperator<string>;

export type NullableStringFilterOperator =
  | EqFilterOperator<string | null>
  | NeqFilterOperator<string | null>
  | InFilterOperator<string | null>
  | NinFilterOperator<string | null>;

export type NumberFilterOperator =
  | EqFilterOperator<number>
  | NeqFilterOperator<number>
  | GtFilterOperator<number>
  | GteFilterOperator<number>
  | LtFilterOperator<number>
  | LteFilterOperator<number>
  | InFilterOperator<number>
  | NinFilterOperator<number>;

export type NullableNumberFilterOperator =
  | EqFilterOperator<number | null>
  | NeqFilterOperator<number | null>
  | GtFilterOperator<number>
  | GteFilterOperator<number>
  | LtFilterOperator<number>
  | LteFilterOperator<number>
  | InFilterOperator<number | null>
  | NinFilterOperator<number | null>;

export type BooleanFilterOperator =
  | EqFilterOperator<boolean>
  | NeqFilterOperator<boolean>;

export type NullableBooleanFilterOperator =
  | EqFilterOperator<boolean | null>
  | NeqFilterOperator<boolean | null>;
