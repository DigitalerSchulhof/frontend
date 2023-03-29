import * as TTLCache from '@isaacs/ttlcache';
import { CacheAdapter } from '.';

export class MemoryCacheAdapter implements CacheAdapter {
  private readonly cache;

  constructor() {
    this.cache = new TTLCache<string, unknown>();
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async getMany<T>(keys: readonly string[]): Promise<(T | undefined)[]> {
    return keys.map((key) => this.cache.get(key));
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    this.cache.set(key, value, {
      ttl: ttlMs,
    });
  }

  async setMany<T>(
    entries: readonly [string, T][],
    ttlMs?: number
  ): Promise<void> {
    entries.forEach(([key, value]) =>
      this.cache.set(key, value, {
        ttl: ttlMs,
      })
    );
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async hasMany(keys: readonly string[]): Promise<boolean[]> {
    return keys.map((key) => this.cache.has(key));
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async deleteMany(keys: readonly string[]): Promise<boolean[]> {
    return keys.map((key) => this.cache.delete(key));
  }
}
