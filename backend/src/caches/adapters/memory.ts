import * as LRUCache from 'lru-cache';
import { CacheAdapter } from '.';

export class MemoryCacheAdapter implements CacheAdapter {
  private readonly cache: LRUCache<string, unknown>;

  constructor(max: number) {
    this.cache = new LRUCache({ max });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key) as T | undefined;
  }

  async getMany<T>(keys: readonly string[]): Promise<(T | undefined)[]> {
    return keys.map((key) => this.cache.get(key) as T | undefined);
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
  }

  async setMany<T>(entries: readonly [string, T][]): Promise<void> {
    entries.forEach(([key, value]) => this.cache.set(key, value));
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async deleteMany(keys: readonly string[]): Promise<boolean> {
    return keys.map((key) => this.cache.delete(key)).every((r) => r);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
