export interface CacheAdapter {
  get<T>(key: string): Promise<T | undefined>;
  getMany<T>(keys: readonly string[]): Promise<(T | undefined)[]>;

  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  setMany<T>(entries: readonly [string, T][], ttlMs?: number): Promise<void>;

  has(key: string): Promise<boolean>;
  hasMany(keys: readonly string[]): Promise<boolean[]>;

  delete(key: string): Promise<boolean>;
  deleteMany(keys: readonly string[]): Promise<boolean[]>;
}
