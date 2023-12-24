export interface HasId {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}

export interface SearchOptions<Filter> {
  limit?: number;
  offset?: number;
  filter?: Filter;
  order?: string;
}

export interface ListResult<T> {
  total: number;
  items: T[];
}
