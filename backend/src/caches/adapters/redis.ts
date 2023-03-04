import { Redis } from 'ioredis';
import { CacheAdapter } from '.';

export class RedisCacheAdapter implements CacheAdapter {
  private readonly client: Redis;

  constructor(
    readonly host: string,
    readonly port: number,
    readonly password?: string
  ) {
    this.client = new Redis({
      host,
      port,
      password,
    });
  }

  private serialize<T>(value: T): string {
    return JSON.stringify(value);
  }

  private deserialize<T>(this: void, value: string | null): T | undefined {
    if (value === null) return undefined;
    return JSON.parse(value) as T;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const res = await this.client.get(key);

    return this.deserialize<T>(res);
  }

  async getMany<T>(keys: readonly string[]): Promise<(T | undefined)[]> {
    const res = await this.client.mget(...keys);

    return res.map(this.deserialize<T>);
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    await this.client.set(key, this.serialize(value), 'PX', ttlMs);
  }

  async setMany<T>(
    entries: readonly [string, T][],
    ttlMs: number
  ): Promise<void> {
    const args = entries.flatMap(([key, value]) => [
      key,
      this.serialize(value),
      'PX',
      ttlMs,
    ]);

    await this.client.mset(...args);
  }

  async delete(key: string): Promise<boolean> {
    return (await this.client.del(key)) === 1;
  }

  async deleteMany(keys: readonly string[]): Promise<boolean> {
    return (await this.client.del(...keys)) === keys.length;
  }

  async clear(): Promise<void> {
    await this.client.flushall();
  }
}
