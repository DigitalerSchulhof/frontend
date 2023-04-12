import { CacheAdapter } from '../adapters';
import { ObjectCache, serialize } from '../object-cache';

const mockCacheAdapter = {
  get: jest.fn(),
  getMany: jest.fn(),
  set: jest.fn(),
  setMany: jest.fn(),
  has: jest.fn(),
  hasMany: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
} satisfies CacheAdapter;

const cache = new ObjectCache(mockCacheAdapter, 'mock-cache', '69', 420);

describe('Cache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return undefined if there is nothing cached', async () => {
      mockCacheAdapter.get.mockImplementationOnce(() =>
        Promise.resolve(undefined)
      );

      const value = await cache.get('foo');

      expect(value).toBeUndefined();
    });

    it('should return cached value', async () => {
      mockCacheAdapter.get.mockImplementationOnce(() =>
        Promise.resolve(serialize('bar'))
      );

      const value = await cache.get('foo');

      expect(value).toBe('bar');
      expect(mockCacheAdapter.get).toHaveBeenCalledWith('mock-cache:69:foo');
    });

    it('uses prefix', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69');
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69');

      await cacheA.get('foo');
      await cacheB.get('foo');

      expect(mockCacheAdapter.get).toHaveBeenCalledWith('cache-a:69:foo');
      expect(mockCacheAdapter.get).toHaveBeenCalledWith('cache-b:69:foo');
    });

    it('uses version', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1');
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2');

      await cacheA.get('foo');
      await cacheB.get('foo');

      expect(mockCacheAdapter.get).toHaveBeenCalledWith('mock-cache:1:foo');
      expect(mockCacheAdapter.get).toHaveBeenCalledWith('mock-cache:2:foo');
    });

    it("uses default version if it's not provided", async () => {
      const cache = new ObjectCache(mockCacheAdapter, 'mock-cache');

      await cache.get('foo');

      expect(mockCacheAdapter.get).toHaveBeenCalledWith('mock-cache:1:foo');
    });
  });

  describe('getMany', () => {
    it('should return undefined if there is nothing cached', async () => {
      mockCacheAdapter.getMany.mockImplementationOnce(() =>
        Promise.resolve([undefined, undefined])
      );

      const value = await cache.getMany(['foo', 'bar']);

      expect(value).toEqual([undefined, undefined]);
    });

    it('should return cached value', async () => {
      mockCacheAdapter.getMany.mockImplementationOnce(() =>
        Promise.resolve([serialize('bar'), serialize('baz')])
      );

      const value = await cache.getMany(['foo', 'bar']);

      expect(value).toEqual(['bar', 'baz']);
      expect(mockCacheAdapter.getMany).toHaveBeenCalledWith([
        'mock-cache:69:foo',
        'mock-cache:69:bar',
      ]);
    });

    it('mixes undefined and cached values', async () => {
      mockCacheAdapter.getMany.mockImplementationOnce(() =>
        Promise.resolve([undefined, serialize('baz')])
      );

      const value = await cache.getMany(['foo', 'bar']);

      expect(value).toEqual([undefined, 'baz']);
    });

    it('uses prefix', async () => {
      mockCacheAdapter.getMany.mockImplementation(() => Promise.resolve([]));

      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69');
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69');

      await cacheA.getMany(['foo', 'bar']);
      await cacheB.getMany(['foo', 'bar']);

      expect(mockCacheAdapter.getMany).toHaveBeenCalledWith([
        'cache-a:69:foo',
        'cache-a:69:bar',
      ]);
      expect(mockCacheAdapter.getMany).toHaveBeenCalledWith([
        'cache-b:69:foo',
        'cache-b:69:bar',
      ]);
    });

    it('uses version', async () => {
      mockCacheAdapter.getMany.mockImplementation(() => Promise.resolve([]));

      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1');
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2');

      await cacheA.getMany(['foo', 'bar']);
      await cacheB.getMany(['foo', 'bar']);

      expect(mockCacheAdapter.getMany).toHaveBeenCalledWith([
        'mock-cache:1:foo',
        'mock-cache:1:bar',
      ]);
      expect(mockCacheAdapter.getMany).toHaveBeenCalledWith([
        'mock-cache:2:foo',
        'mock-cache:2:bar',
      ]);
    });

    it("uses default version if it's not provided", async () => {
      mockCacheAdapter.getMany.mockImplementationOnce(() =>
        Promise.resolve([])
      );

      const cache = new ObjectCache(mockCacheAdapter, 'mock-cache');

      await cache.getMany(['foo', 'bar']);

      expect(mockCacheAdapter.getMany).toHaveBeenCalledWith([
        'mock-cache:1:foo',
        'mock-cache:1:bar',
      ]);
    });
  });

  describe('set', () => {
    it('should set value', async () => {
      await cache.set('foo', 'bar');

      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'mock-cache:69:foo',
        serialize('bar'),
        420
      );
    });

    it('sets ttl', async () => {
      await cache.set('foo', 'bar', 1000);

      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'mock-cache:69:foo',
        serialize('bar'),
        1000
      );
    });

    it("falls back to default ttl if it's not provided", async () => {
      await cache.set('foo', 'bar');

      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'mock-cache:69:foo',
        serialize('bar'),
        420
      );
    });

    it('uses prefix', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69', 420);
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69', 420);

      await cacheA.set('foo', 'bar');
      await cacheB.set('foo', 'baz');

      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'cache-a:69:foo',
        serialize('bar'),
        420
      );
      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'cache-b:69:foo',
        serialize('baz'),
        420
      );
    });

    it('uses version', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1', 420);
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2', 420);

      await cacheA.set('foo', 'bar');
      await cacheB.set('foo', 'baz');

      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'mock-cache:1:foo',
        serialize('bar'),
        420
      );
      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'mock-cache:2:foo',
        serialize('baz'),
        420
      );
    });

    it("uses default version if it's not provided", async () => {
      const cache = new ObjectCache(
        mockCacheAdapter,
        'mock-cache',
        undefined,
        420
      );

      await cache.set('foo', 'bar');

      expect(mockCacheAdapter.set).toHaveBeenCalledWith(
        'mock-cache:1:foo',
        serialize('bar'),
        420
      );
    });
  });

  describe('setMany', () => {
    it('should set values', async () => {
      await cache.setMany(['foo', 'bar'], ['baz', 'qux']);

      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['mock-cache:69:foo', serialize('baz')],
          ['mock-cache:69:bar', serialize('qux')],
        ],
        420
      );
    });

    it('sets ttl', async () => {
      await cache.setMany(['foo', 'bar'], ['baz', 'qux'], 1000);

      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['mock-cache:69:foo', serialize('baz')],
          ['mock-cache:69:bar', serialize('qux')],
        ],
        1000
      );
    });

    it("falls back to default ttl if it's not provided", async () => {
      await cache.setMany(['foo', 'bar'], ['baz', 'qux']);

      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['mock-cache:69:foo', serialize('baz')],
          ['mock-cache:69:bar', serialize('qux')],
        ],
        420
      );
    });

    it('uses prefix', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69', 420);
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69', 420);

      await cacheA.setMany(['foo', 'bar'], ['baz', 'qux']);
      await cacheB.setMany(['foo', 'bar'], ['baz', 'qux']);

      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['cache-a:69:foo', serialize('baz')],
          ['cache-a:69:bar', serialize('qux')],
        ],
        420
      );
      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['cache-b:69:foo', serialize('baz')],
          ['cache-b:69:bar', serialize('qux')],
        ],
        420
      );
    });

    it('uses version', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1', 420);
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2', 420);

      await cacheA.setMany(['foo', 'bar'], ['baz', 'qux']);
      await cacheB.setMany(['foo', 'bar'], ['baz', 'qux']);

      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['mock-cache:1:foo', serialize('baz')],
          ['mock-cache:1:bar', serialize('qux')],
        ],
        420
      );
      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['mock-cache:2:foo', serialize('baz')],
          ['mock-cache:2:bar', serialize('qux')],
        ],
        420
      );
    });

    it("uses default version if it's not provided", async () => {
      const cache = new ObjectCache(
        mockCacheAdapter,
        'mock-cache',
        undefined,
        420
      );

      await cache.setMany(['foo', 'bar'], ['baz', 'qux']);

      expect(mockCacheAdapter.setMany).toHaveBeenCalledWith(
        [
          ['mock-cache:1:foo', serialize('baz')],
          ['mock-cache:1:bar', serialize('qux')],
        ],
        420
      );
    });
  });

  describe('has', () => {
    it('should return false if there is nothing cached', async () => {
      mockCacheAdapter.has.mockImplementationOnce(() => Promise.resolve(false));

      const value = await cache.has('foo');

      expect(value).toBe(false);
    });

    it('should return true if there is something cached', async () => {
      mockCacheAdapter.has.mockImplementationOnce(() => Promise.resolve(true));

      const value = await cache.has('foo');

      expect(value).toBe(true);
      expect(mockCacheAdapter.has).toHaveBeenCalledWith('mock-cache:69:foo');
    });

    it('uses prefix', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69');
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69');

      await cacheA.has('foo');
      await cacheB.has('foo');

      expect(mockCacheAdapter.has).toHaveBeenCalledWith('cache-a:69:foo');
      expect(mockCacheAdapter.has).toHaveBeenCalledWith('cache-b:69:foo');
    });

    it('uses version', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1');
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2');

      await cacheA.has('foo');
      await cacheB.has('foo');

      expect(mockCacheAdapter.has).toHaveBeenCalledWith('mock-cache:1:foo');
      expect(mockCacheAdapter.has).toHaveBeenCalledWith('mock-cache:2:foo');
    });

    it("uses default version if it's not provided", async () => {
      const cache = new ObjectCache(mockCacheAdapter, 'mock-cache');

      await cache.has('foo');

      expect(mockCacheAdapter.has).toHaveBeenCalledWith('mock-cache:1:foo');
    });
  });

  describe('hasMany', () => {
    it('should return false if there is nothing cached', async () => {
      mockCacheAdapter.hasMany.mockImplementationOnce(() =>
        Promise.resolve([false, false])
      );

      const value = await cache.hasMany(['foo', 'bar']);

      expect(value).toEqual([false, false]);
    });

    it('should return true if there is something cached', async () => {
      mockCacheAdapter.hasMany.mockImplementationOnce(() =>
        Promise.resolve([true, true])
      );

      const value = await cache.hasMany(['foo', 'bar']);

      expect(value).toEqual([true, true]);
      expect(mockCacheAdapter.hasMany).toHaveBeenCalledWith([
        'mock-cache:69:foo',
        'mock-cache:69:bar',
      ]);
    });

    it("mixes results if there's a mix of cached and uncached", async () => {
      mockCacheAdapter.hasMany.mockImplementationOnce(() =>
        Promise.resolve([true, false])
      );

      const value = await cache.hasMany(['foo', 'bar']);

      expect(value).toEqual([true, false]);
      expect(mockCacheAdapter.hasMany).toHaveBeenCalledWith([
        'mock-cache:69:foo',
        'mock-cache:69:bar',
      ]);
    });

    it('uses prefix', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69');
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69');

      await cacheA.hasMany(['foo', 'bar']);
      await cacheB.hasMany(['foo', 'bar']);

      expect(mockCacheAdapter.hasMany).toHaveBeenCalledWith([
        'cache-a:69:foo',
        'cache-a:69:bar',
      ]);
      expect(mockCacheAdapter.hasMany).toHaveBeenCalledWith([
        'cache-b:69:foo',
        'cache-b:69:bar',
      ]);
    });

    it('uses version', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1');
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2');

      await cacheA.hasMany(['foo', 'bar']);
      await cacheB.hasMany(['foo', 'bar']);

      expect(mockCacheAdapter.hasMany).toHaveBeenCalledWith([
        'mock-cache:1:foo',
        'mock-cache:1:bar',
      ]);
      expect(mockCacheAdapter.hasMany).toHaveBeenCalledWith([
        'mock-cache:2:foo',
        'mock-cache:2:bar',
      ]);
    });

    it("uses default version if it's not provided", async () => {
      const cache = new ObjectCache(mockCacheAdapter, 'mock-cache');

      await cache.hasMany(['foo', 'bar']);

      expect(mockCacheAdapter.hasMany).toHaveBeenCalledWith([
        'mock-cache:1:foo',
        'mock-cache:1:bar',
      ]);
    });
  });

  describe('delete', () => {
    it('should delete value', async () => {
      await cache.delete('foo');

      expect(mockCacheAdapter.delete).toHaveBeenCalledWith('mock-cache:69:foo');
    });

    it('uses prefix', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69');
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69');

      await cacheA.delete('foo');
      await cacheB.delete('foo');

      expect(mockCacheAdapter.delete).toHaveBeenCalledWith('cache-a:69:foo');
      expect(mockCacheAdapter.delete).toHaveBeenCalledWith('cache-b:69:foo');
    });

    it('uses version', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1');
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2');

      await cacheA.delete('foo');
      await cacheB.delete('foo');

      expect(mockCacheAdapter.delete).toHaveBeenCalledWith('mock-cache:1:foo');
      expect(mockCacheAdapter.delete).toHaveBeenCalledWith('mock-cache:2:foo');
    });

    it("uses default version if it's not provided", async () => {
      const cache = new ObjectCache(mockCacheAdapter, 'mock-cache');

      await cache.delete('foo');

      expect(mockCacheAdapter.delete).toHaveBeenCalledWith('mock-cache:1:foo');
    });
  });

  describe('deleteMany', () => {
    it('should delete values', async () => {
      await cache.deleteMany(['foo', 'bar']);

      expect(mockCacheAdapter.deleteMany).toHaveBeenCalledWith([
        'mock-cache:69:foo',
        'mock-cache:69:bar',
      ]);
    });

    it('uses prefix', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'cache-a', '69');
      const cacheB = new ObjectCache(mockCacheAdapter, 'cache-b', '69');

      await cacheA.deleteMany(['foo', 'bar']);
      await cacheB.deleteMany(['foo', 'bar']);

      expect(mockCacheAdapter.deleteMany).toHaveBeenCalledWith([
        'cache-a:69:foo',
        'cache-a:69:bar',
      ]);
      expect(mockCacheAdapter.deleteMany).toHaveBeenCalledWith([
        'cache-b:69:foo',
        'cache-b:69:bar',
      ]);
    });

    it('uses version', async () => {
      const cacheA = new ObjectCache(mockCacheAdapter, 'mock-cache', '1');
      const cacheB = new ObjectCache(mockCacheAdapter, 'mock-cache', '2');

      await cacheA.deleteMany(['foo', 'bar']);
      await cacheB.deleteMany(['foo', 'bar']);

      expect(mockCacheAdapter.deleteMany).toHaveBeenCalledWith([
        'mock-cache:1:foo',
        'mock-cache:1:bar',
      ]);
      expect(mockCacheAdapter.deleteMany).toHaveBeenCalledWith([
        'mock-cache:2:foo',
        'mock-cache:2:bar',
      ]);
    });

    it("uses default version if it's not provided", async () => {
      const cache = new ObjectCache(mockCacheAdapter, 'mock-cache');

      await cache.deleteMany(['foo', 'bar']);

      expect(mockCacheAdapter.deleteMany).toHaveBeenCalledWith([
        'mock-cache:1:foo',
        'mock-cache:1:bar',
      ]);
    });
  });
});
