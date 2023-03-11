import { ObjectCache } from '@caches/object-cache';

interface RepositoryWithGetByIds<T> {
  getByIds(ids: readonly string[]): Promise<(T | null)[]>;
}

export async function getByIdsCachedOrLoad<T>(
  cache: ObjectCache<T>,
  repository: RepositoryWithGetByIds<T>,
  ids: readonly string[]
): Promise<(T | null)[]> {
  const { cached, remainingIds } = await getCachedAndRemainingIds(cache, ids);

  if (remainingIds.length === 0) {
    return cached as (T | null)[];
  }

  const loadedMap = await loadAndCache(cache, repository, remainingIds);

  return mapIdsFromCacheOrLoaded(ids, cached, loadedMap);
}

async function getCachedAndRemainingIds<T>(
  cache: ObjectCache<T>,
  ids: readonly string[]
): Promise<{
  cached: (T | null | undefined)[];
  remainingIds: string[];
}> {
  const cached = await cache.getMany(ids);

  const remainingIds = ids.filter((_, i) => cached[i] === undefined);

  return { cached, remainingIds };
}

async function loadAndCache<T>(
  cache: ObjectCache<T>,
  repository: RepositoryWithGetByIds<T>,
  ids: readonly string[]
): Promise<Map<string, T | null>> {
  const loaded = await repository.getByIds(ids);

  await cache.setMany(ids, loaded);

  return new Map(ids.map((id, i) => [id, loaded[i]]));
}

function mapIdsFromCacheOrLoaded<T>(
  ids: readonly string[],
  cached: (T | null | undefined)[],
  loadedMap: ReadonlyMap<string, T | null>
): (T | null)[] {
  return ids.map((id, i) => cached[i] ?? loadedMap.get(id) ?? null);
}
