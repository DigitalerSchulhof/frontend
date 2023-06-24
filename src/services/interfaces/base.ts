export type WithId<T> = T & {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: number;
  readonly createdAt: number;
};

export interface ListOptions<Base extends object> {
  limit?: number;
  offset?: number;
  filter?: BaseFilter<Base>;
  order?: string;
}

export interface ListResult<T> {
  total: number;
  items: T[];
}

type SignaturesFor<T, P extends string = ''> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? SignaturesFor<T[K], `${P}${K & string}.`>
        : TuplesFor<`${P}${K & string}`, T[K]>;
    }[keyof T]
  : never;

type TuplesFor<K, T> = [T] extends [number]
  ? [K, 'eq' | 'neq' | 'gt' | 'lt', T] | [K, 'in' | 'nin', T[]]
  : [T] extends [string]
  ? [K, 'eq' | 'neq' | 'like' | 'nlike', T] | [K, 'in' | 'nin', T[]]
  : [T] extends [boolean]
  ? [K, 'eq' | 'neq', T]
  : [T] extends [number | null]
  ? [K, 'eq' | 'neq', T] | [K, 'in' | 'nin', T[]]
  : [T] extends [string | null]
  ? [K, 'eq' | 'neq', T] | [K, 'in' | 'nin', T[]]
  : [T] extends [boolean | null]
  ? [K, 'eq' | 'neq', T]
  : never;

export interface BaseService<Base extends object> {
  search(options: ListOptions<Base>): Promise<ListResult<WithId<Base>>>;
  get(id: string): Promise<WithId<Base> | null>;
  getByIds(ids: readonly string[]): Promise<(WithId<Base> | null)[]>;
  create(data: Base): Promise<WithId<Base>>;
  update(
    id: string,
    data: Partial<Base>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;
  delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;
  deleteWhere(filter: BaseFilter<Base>): Promise<WithId<Base>[]>;
}

export abstract class BaseFilter<Base extends object> {
  declare _obj: Base;
  property;
  operator;
  value;

  constructor(...args: SignaturesFor<Base>) {
    // @ts-expect-error -- ???
    [this.property, this.operator, this.value] = args;
  }
}

export class AndFilter<Base extends object> extends BaseFilter<Base> {
  filters;

  constructor(...filters: (BaseFilter<Base> | null)[]) {
    // @ts-expect-error -- test
    super('and', 'and', 'and');
    this.filters = filters;
  }
}
