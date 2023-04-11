import ms from 'ms';
import { CacheAdapter } from './adapters';

const FIVE_HOURS_MS = ms('5h');

export class ObjectCache<T> {
  constructor(
    private readonly adapter: CacheAdapter,
    private readonly prefix: string,
    private readonly version: string = '1',
    private readonly defaultTtlMs: number = FIVE_HOURS_MS
  ) {}

  private getCacheKey(key: string): string {
    return `${this.prefix}:${this.version}:${key}`;
  }

  async get(key: string): Promise<T | null | undefined> {
    const cacheKey = this.getCacheKey(key);

    console.log('get', cacheKey);

    const res = await this.adapter.get(cacheKey);

    return deserialize(res);
  }

  async getMany<const K extends readonly string[]>(
    keys: K
  ): Promise<{
    -readonly [P in keyof K]: T | null | undefined;
  }> {
    const cacheKeys = keys.map((key) => this.getCacheKey(key));

    console.log('getMany', cacheKeys);

    const res = await this.adapter.getMany(cacheKeys);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I don't know how to type this better
    return res.map(deserialize<T>) as any;
  }

  async set(
    key: string,
    value: T | null,
    ttlMs: number = this.defaultTtlMs
  ): Promise<void> {
    const cacheKey = this.getCacheKey(key);

    console.log('set', cacheKey, value);

    return this.adapter.set(cacheKey, serialize(value), ttlMs);
  }

  async setMany<const K extends readonly string[]>(
    keys: K,
    values: {
      [P in keyof K]: T | null;
    },
    ttlMs: number = this.defaultTtlMs
  ): Promise<void> {
    const cacheKeys = keys.map((key) => this.getCacheKey(key));

    console.log('setMany', cacheKeys, values);

    return this.adapter.setMany(
      cacheKeys.map((key, i) => [key, serialize(values[i])]),
      ttlMs
    );
  }

  async has(key: string): Promise<boolean> {
    return this.adapter.has(this.getCacheKey(key));
  }

  async hasMany<const K extends readonly string[]>(
    keys: K
  ): Promise<{
    -readonly [P in keyof K]: boolean;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I don't know how to type this better
    return this.adapter.hasMany(keys.map((k) => this.getCacheKey(k))) as any;
  }

  async delete(key: string): Promise<boolean> {
    return this.adapter.delete(this.getCacheKey(key));
  }

  async deleteMany<const K extends readonly string[]>(
    keys: K
  ): Promise<{
    -readonly [P in keyof K]: boolean;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I don't know how to type this better
    return this.adapter.deleteMany(keys.map((k) => this.getCacheKey(k))) as any;
  }
}

export function serialize(value: unknown): string {
  return JSON.stringify(value);
}

function deserialize<T>(value: string | undefined): T | undefined {
  if (value === undefined) return undefined;
  return JSON.parse(value) as T;
}
