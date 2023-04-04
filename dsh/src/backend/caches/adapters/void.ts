import { CacheAdapter } from '.';

export class VoidCacheAdapter implements CacheAdapter {
  async get(): Promise<undefined> {
    return undefined;
  }

  async getMany(keys: readonly string[]): Promise<undefined[]> {
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
