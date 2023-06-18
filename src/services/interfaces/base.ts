export interface BaseService<Base, Create = Base, Update = Partial<Create>> {
  list(options: ListOptions): Promise<ListResult<Base>>;
  get(id: string): Promise<Base | null>;
  getByIds(ids: readonly string[]): Promise<(Base | null)[]>;
  create(data: Create): Promise<Base>;
  update(id: string, data: Update): Promise<Base>;
  delete(id: string): Promise<Base>;
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
