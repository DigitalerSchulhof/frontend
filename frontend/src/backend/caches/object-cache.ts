import { CacheAdapter } from './adapters';

export class ObjectCache<T> {
  constructor(
    private readonly adapter: CacheAdapter,
    private readonly prefix: string,
    private readonly version: string = '1',
    private readonly defaultTtlMs: number = 1000 * 60 * 5
  ) {}

  private addPrefix(key: string): string {
    return `${this.prefix}:${this.version}:${key}`;
  }

  async get(key: string): Promise<T | null | undefined> {
    return this.adapter.get(this.addPrefix(key));
  }

  async getMany(keys: readonly string[]): Promise<(T | null | undefined)[]> {
    return this.adapter.getMany(keys.map((k) => this.addPrefix(k)));
  }

  async set(
    key: string,
    value: T | null,
    ttlMs: number = this.defaultTtlMs
  ): Promise<void> {
    return this.adapter.set(this.addPrefix(key), value, ttlMs);
  }

  async setMany(
    keys: readonly string[],
    values: readonly (T | null)[],
    ttlMs: number = this.defaultTtlMs
  ): Promise<void> {
    if (keys.length !== values.length) {
      throw new Error('Keys and values must be the same length');
    }

    return this.adapter.setMany(
      keys.map((key, i) => [this.addPrefix(key), values[i]]),
      ttlMs
    );
  }

  async has(key: string): Promise<boolean> {
    return this.adapter.has(this.addPrefix(key));
  }

  async hasMany(keys: readonly string[]): Promise<boolean[]> {
    return this.adapter.hasMany(keys.map((k) => this.addPrefix(k)));
  }

  async delete(key: string): Promise<boolean> {
    return this.adapter.delete(this.addPrefix(key));
  }

  async deleteMany(keys: readonly string[]): Promise<boolean[]> {
    return this.adapter.deleteMany(keys.map((k) => this.addPrefix(k)));
  }
}
