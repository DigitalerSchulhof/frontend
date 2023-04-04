import TTLCache from '@isaacs/ttlcache';
import * as fs from 'fs';
import * as path from 'path';
import { CacheAdapter } from '.';

type CacheExport = Record<string, [string, number]>;

export class MemoryCacheAdapter implements CacheAdapter {
  private readonly cache: TTLCache<string, string>;

  /**
   * Beware that creating two MemoryCacheAdapters with the same diskCacheLocation
   * will cause them overwrite each other's save file.
   */
  constructor(private readonly diskCacheLocation?: string) {
    this.cache = new TTLCache();

    if (this.diskCacheLocation) {
      fs.mkdirSync(path.dirname(this.diskCacheLocation), { recursive: true });

      this.tryToLoadFromDisk();
    }
  }

  async get(key: string): Promise<string | undefined> {
    return this.cache.get(key);
  }

  async getMany(keys: readonly string[]): Promise<(string | undefined)[]> {
    return keys.map((key) => this.cache.get(key));
  }

  async set(key: string, value: string, ttlMs?: number): Promise<void> {
    this.cache.set(key, value, {
      ttl: ttlMs,
    });

    // Don't wait for the disk write to complete
    void this.saveCacheToDisk();
  }

  async setMany(
    entries: readonly [string, string][],
    ttlMs?: number
  ): Promise<void> {
    for (const [key, value] of entries) {
      this.cache.set(key, value, {
        ttl: ttlMs,
      });
    }

    // Don't wait for the disk write to complete
    void this.saveCacheToDisk();
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async hasMany(keys: readonly string[]): Promise<boolean[]> {
    return keys.map((key) => this.cache.has(key));
  }

  async delete(key: string): Promise<boolean> {
    const res = this.cache.delete(key);

    // Don't wait for the disk write to complete
    void this.saveCacheToDisk();

    return res;
  }

  async deleteMany(keys: readonly string[]): Promise<boolean[]> {
    const res = keys.map((key) => this.cache.delete(key));

    // Don't wait for the disk write to complete
    void this.saveCacheToDisk();

    return res;
  }

  private tryToLoadFromDisk(): void {
    if (!this.diskCacheLocation || !fs.existsSync(this.diskCacheLocation)) {
      return;
    }

    const cacheExport = fs.readFileSync(this.diskCacheLocation, 'utf8');

    this.importCacheFromString(cacheExport);
  }

  private previousSaveCacheToDiskController: AbortController | undefined;

  private async saveCacheToDisk(): Promise<void> {
    if (!this.shouldSaveCacheToDisk()) return;

    if (this.previousSaveCacheToDiskController) {
      this.previousSaveCacheToDiskController.abort();
    }
    this.previousSaveCacheToDiskController = new AbortController();

    const cacheExport = this.exportCacheToString();

    try {
      await fs.promises.writeFile(this.diskCacheLocation!, cacheExport, {
        signal: this.previousSaveCacheToDiskController.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // The previous save was aborted, so we don't need to do anything
      } else {
        throw error;
      }
    }

    this.previousSaveCacheToDiskController = undefined;
  }

  private shouldSaveCacheToDisk(): boolean {
    return !!this.diskCacheLocation;
  }

  private importCacheFromString(cacheExport: string): void {
    const cacheExportJson = JSON.parse(cacheExport) as CacheExport;

    const now = Date.now();

    for (const [key, [value, ttlPlusNow]] of Object.entries(cacheExportJson)) {
      const ttl = ttlPlusNow - now;

      if (ttl > 0) {
        this.cache.set(key, value, {
          ttl,
        });
      }
    }
  }

  private exportCacheToString(): string {
    const cacheExport: CacheExport = {};

    const now = Date.now();

    for (const [key, value] of this.cache) {
      const ttl = this.cache.getRemainingTTL(key);
      if (ttl > 0) {
        const ttlPlusNow = ttl + now;

        cacheExport[key] = [value, ttlPlusNow];
      }
    }

    return JSON.stringify(cacheExport);
  }
}
