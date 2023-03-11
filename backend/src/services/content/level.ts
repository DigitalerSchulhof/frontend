import { ObjectCache } from '@caches/object-cache';
import { ClassLevelIdFilter } from '@repositories/class/filters';
import {
  Level,
  LevelBase,
  LevelPatch,
  LevelRepository,
  LevelSearchQuery,
} from '@repositories/level';
import { LevelFilter } from '@repositories/level/filters';
import { LevelValidator } from '@validators/level';
import {
  EqFilterOperator,
  InFilterOperator,
} from '../../repositories/filters/operators/base';
import { Paginated } from '../../repositories/search';
import { Services } from '../../server/context/services';
import { getByIdsCachedOrLoad } from '../utils';

export class LevelService {
  constructor(
    private readonly repository: LevelRepository,
    private readonly cache: ObjectCache<Level>,
    private readonly validator: LevelValidator,
    private readonly services: Services
  ) {}

  async getById(id: string): Promise<Level | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(Level | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async create(post: LevelBase): Promise<Level> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(id: string, patch: LevelPatch, ifRev?: string): Promise<Level> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<Level> {
    const res = await this.repository.delete(id, ifRev);

    await Promise.all([
      this.cache.delete(id),

      this.services.class.filterDelete(
        new ClassLevelIdFilter(new EqFilterOperator(id))
      ),
    ]);

    return res;
  }

  async filterDelete(filter: LevelFilter): Promise<Level[]> {
    const res = await this.repository.filterDelete(filter);

    const levelIds = res.map((r) => r.id);

    await Promise.all([
      this.cache.deleteMany(levelIds),

      await this.services.class.filterDelete(
        new ClassLevelIdFilter(new InFilterOperator(levelIds))
      ),
    ]);

    return res;
  }

  async search(query: LevelSearchQuery): Promise<Paginated<Level>> {
    return this.repository.search(query);
  }
}
