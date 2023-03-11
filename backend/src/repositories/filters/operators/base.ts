import * as aql from 'arangojs/aql';
import { MaybeArray } from '../../../utils';

export abstract class FilterOperator {
  // TODO: Restrict implementing classes to only allow certain operators/value types
  constructor(
    private readonly operator: Operator,
    private readonly value: MaybeArray<string | number | boolean>
  ) {}

  private getOperator(): aql.AqlLiteral {
    switch (this.operator) {
      case Operator.eq:
        return aql.literal('==');
      case Operator.neq:
        return aql.literal('!=');
      case Operator.gt:
        return aql.literal('>');
      case Operator.gte:
        return aql.literal('>=');
      case Operator.lt:
        return aql.literal('<');
      case Operator.lte:
        return aql.literal('<=');
      case Operator.in:
        return aql.literal('IN');
      case Operator.nin:
        return aql.literal('NOT IN');
    }
  }

  private getValue(): aql.GeneratedAqlQuery {
    return aql.aql`${this.value}`;
  }

  apply(): aql.GeneratedAqlQuery {
    this.assertValueIsValid();

    return aql.aql`${this.getOperator()} ${this.getValue()}`;
  }

  private assertValueIsValid(): void | never {
    switch (this.operator) {
      case Operator.eq:
      case Operator.neq:
        this.assertValueIsNonArray();
        break;
      case Operator.lt:
      case Operator.gt:
      case Operator.gte:
      case Operator.lte:
        this.assertValueIsNonArray();
        this.assertValueIsNumber();
        break;
      case Operator.in:
      case Operator.nin:
        this.assertValueIsArray();
        break;
    }
  }

  private assertValueIsNonArray(): void | never {
    if (Array.isArray(this.value)) {
      throw new Error(
        `Filter operator ${this.operator} does not support array values`
      );
    }
  }

  private assertValueIsArray(): void | never {
    if (!Array.isArray(this.value)) {
      throw new Error(`Filter operator ${this.operator} requires array values`);
    }
  }

  private assertValueIsNumber(): void | never {
    if (typeof this.value !== 'number') {
      throw new Error(
        `Filter operator ${this.operator} requires number values`
      );
    }
  }
}

export enum Operator {
  eq,
  neq,
  gt,
  gte,
  lt,
  lte,
  in,
  nin,
}
