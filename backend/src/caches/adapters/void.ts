import { CacheAdapter } from '.';

export class VoidCacheAdapter implements CacheAdapter {
  async get<T>(): Promise<T | undefined> {
    return undefined;
  }

  async getMany<T>(keys: readonly string[]): Promise<(T | undefined)[]> {
    return keys.map(() => undefined);
  }

  async set(): Promise<void> {
    // Do nothing
  }

  async setMany(): Promise<void> {
    // Do nothing
  }

  async delete(): Promise<boolean> {
    return true;
  }

  async deleteMany(): Promise<boolean> {
    return true;
  }

  async clear(): Promise<void> {
    // Do nothing
  }
}
