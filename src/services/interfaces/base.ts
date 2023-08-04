import type { MaybeArray } from '#/utils';

export type WithId<T> = T & {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};

export interface SearchOptions<Base extends object> {
  limit?: number;
  offset?: number;
  filter?: TypeFilter<Base>;
  order?: string;
}

export interface ListResult<T> {
  total: number;
  items: T[];
}

export type OverloadsForObject<
  Type extends object,
  Path extends string = '',
> = Type extends unknown
  ? {
      [Key in keyof Type & string]: Type[Key] extends
        | number
        | string
        | boolean
        | Buffer
        | null
        ? OverloadsForScalar<`${Path}${Key}`, Type[Key]>
        : Type[Key] extends object
        ? OverloadsForObject<Type[Key], `${Path}${Key}.`>
        : never;
    }[keyof Type & string]
  : never;

type OverloadsForScalar<Key, Type> = [Type] extends [number]
  ? [Key, 'eq' | 'neq' | 'gt' | 'lt', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [string]
  ? [Key, 'eq' | 'neq' | 'like' | 'nlike', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [boolean | Buffer]
  ? [Key, 'eq' | 'neq', Type]
  : [Type] extends [number | null]
  ? [Key, 'eq' | 'neq', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [string | null]
  ? [Key, 'eq' | 'neq', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [boolean | Buffer | null]
  ? [Key, 'eq' | 'neq', Type]
  : never;

export interface BaseService<Base extends object> {
  search(options: SearchOptions<Base>): Promise<ListResult<WithId<Base>>>;

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
  updateWhere(
    filter: TypeFilter<Base>,
    data: Partial<Base>
  ): Promise<WithId<Base>[]>;

  delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;
  deleteWhere(filter: TypeFilter<Base>): Promise<WithId<Base>[]>;
}

export class OrFilter<Type extends object> {
  filters;

  constructor(...filters: TypeFilter<Type>[]) {
    this.filters = filters;
  }
}

export class AndFilter<Type extends object> {
  filters;

  constructor(...filters: TypeFilter<Type>[]) {
    this.filters = filters;
  }
}

export class Filter<Type extends object = object> {
  property: string;
  operator: string;
  value: MaybeArray<number | string | boolean | Buffer | null>;

  constructor(...args: OverloadsForObject<Type>) {
    // @ts-expect-error -- Not sure
    [this.property, this.operator, this.value] = args;
  }
}

export type TypeFilter<Type extends object> =
  | OrFilter<Type>
  | AndFilter<Type>
  | Filter<Type>
  | null;
