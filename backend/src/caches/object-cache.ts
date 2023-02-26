import { CacheAdapter } from './adapters';

export class ObjectCache<T> {
  constructor(
    private readonly adapter: CacheAdapter,
    private readonly prefix: string,
    private readonly DEFAULT_TTL_SECONDS: number = 60 * 5
  ) {}

  private addPrefix(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get(key: string): Promise<T | null | undefined> {
    return this.adapter.get(this.addPrefix(key));
  }

  async getMany(keys: readonly string[]): Promise<(T | null | undefined)[]> {
    return Promise.all(keys.map((key) => this.get(key)));
  }

  async set(
    key: string,
    value: T | null,
    ttlSeconds: number = this.DEFAULT_TTL_SECONDS
  ): Promise<void> {
    return this.adapter.set(this.addPrefix(key), value, ttlSeconds);
  }

  async setMany(
    keys: readonly string[],
    values: readonly (T| null)[],
    ttl: number = this.DEFAULT_TTL_SECONDS
  ): Promise<void> {
    if (keys.length !== values.length) {
      throw new Error('keys and values must have the same length');
    }

    return this.adapter.setMany(
      keys.map((key, i) => [this.addPrefix(key), values[i]]),
      ttl
    );
  }

  async delete(key: string): Promise<boolean> {
    return this.adapter.delete(this.addPrefix(key));
  }

  async deleteMany(keys: readonly string[]): Promise<boolean> {
    return this.adapter.deleteMany(keys.map(this.addPrefix));
  }

  async clear(): Promise<void> {
    return this.adapter.clear();
  }
}
