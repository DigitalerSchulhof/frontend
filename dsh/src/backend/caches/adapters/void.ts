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

  async has(): Promise<boolean> {
    return false;
  }

  async hasMany(keys: readonly string[]): Promise<boolean[]> {
    return keys.map(() => false);
  }

  async delete(): Promise<boolean> {
    return true;
  }

  async deleteMany(keys: readonly string[]): Promise<boolean[]> {
    return keys.map(() => true);
  }
}
