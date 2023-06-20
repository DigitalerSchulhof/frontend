export type WithId<T> = T & {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};

export interface BaseService<Base> {
  list(options: ListOptions): Promise<ListResult<WithId<Base>>>;
  get(id: string): Promise<WithId<Base> | null>;
  getByIds(ids: readonly string[]): Promise<(WithId<Base> | null)[]>;
  create(data: Base): Promise<WithId<Base>>;
  update(id: string, data: Partial<Base>): Promise<WithId<Base>>;
  delete(id: string): Promise<WithId<Base>>;
}

export interface ListOptions {
  limit?: number;
  offset?: number;
  filter?: string;
  order?: string;
}

export interface ListResult<T> {
  total: number;
  items: T[];
}
