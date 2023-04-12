export interface CacheAdapter {
  get(key: string): Promise<string | undefined>;
  getMany(keys: readonly string[]): Promise<(string | undefined)[]>;

  set(key: string, value: string, ttlMs?: number): Promise<void>;
  setMany(entries: readonly [string, string][], ttlMs?: number): Promise<void>;

  has(key: string): Promise<boolean>;
  hasMany(keys: readonly string[]): Promise<boolean[]>;

  delete(key: string): Promise<boolean>;
  deleteMany(keys: readonly string[]): Promise<boolean[]>;
}
