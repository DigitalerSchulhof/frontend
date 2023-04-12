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

  async get(key: string): Promise<string | undefined> {
    return (await this.client.get(key)) ?? undefined;
  }

  async getMany(keys: readonly string[]): Promise<(string | undefined)[]> {
    const res = await this.client.mget(...keys);

    return res.map((r) => r ?? undefined);
  }

  async set(key: string, value: string, ttlMs: number): Promise<void> {
    await this.client.set(key, value, 'PX', ttlMs);
  }

  async setMany(
    entries: readonly [string, string][],
    ttlMs: number
  ): Promise<void> {
    const args = entries.flatMap(([key, value]) => [key, value, 'PX', ttlMs]);

    await this.client.mset(...args);
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async hasMany(keys: readonly string[]): Promise<boolean[]> {
    // TODO: Verify this assertion
    const res = (await this.client.exists(...keys)) as unknown as number[];

    return res.map((exists) => exists === 1);
  }

  async delete(key: string): Promise<boolean> {
    return (await this.client.del(key)) === 1;
  }

  async deleteMany(keys: readonly string[]): Promise<boolean[]> {
    // TODO: Verify this assertion
    const res = (await this.client.del(...keys)) as unknown as number[];

    return res.map((deleted) => deleted === 1);
  }
}
