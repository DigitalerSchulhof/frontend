export interface BaseService<Base, Create, Update = Partial<Base>> {
  list(options: ListOptions): Promise<ListResult<Base>>;
  get(id: string): Promise<Base | null>;
  getByIds(ids: readonly string[]): Promise<Base[]>;
  create(data: Create): Promise<Base>;
  update(id: string, data: Update): Promise<Base>;
  delete(id: string): Promise<Base>;
}

export interface ListOptions {
  limit?: number;
  offset?: number;
