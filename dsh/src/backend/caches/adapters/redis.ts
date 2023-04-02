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

  async get<T>(key: string): Promise<T | undefined> {
    const res = await this.client.get(key);

    return deserialize(res);
  }

  async getMany<T>(keys: readonly string[]): Promise<(T | undefined)[]> {
    const res = await this.client.mget(...keys);

    return res.map(deserialize<T>);
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    await this.client.set(key, serialize(value), 'PX', ttlMs);
  }

  async setMany<T>(
    entries: readonly [string, T][],
    ttlMs: number
  ): Promise<void> {
    const args = entries.flatMap(([key, value]) => [
      key,
      serialize(value),
      'PX',
      ttlMs,
    ]);

    await this.client.mset(...args);
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async hasMany(keys: readonly string[]): Promise<boolean[]> {
    // TODO: Verify this assertion
    const res = (await this.client.exists(...keys)) as unknown as number[];

    return res.map((r) => r === 1);
  }

  async delete(key: string): Promise<boolean> {
    return (await this.client.del(key)) === 1;
  }

  async deleteMany(keys: readonly string[]): Promise<boolean[]> {
    // TODO: Verify this assertion
    const res = (await this.client.del(...keys)) as unknown as number[];

    return res.map((r) => r === 1);
  }
}

function serialize<T>(value: T): string {
  return JSON.stringify(value);
}

function deserialize<T>(value: string | null): T | undefined {
  if (value === null) return undefined;
  return JSON.parse(value) as T;
}
