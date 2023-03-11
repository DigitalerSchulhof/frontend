import { ObjectCache } from '@caches/object-cache';
import { LevelSchoolyearIdFilter } from '@repositories/level/filters';
import {
  Schoolyear,
  SchoolyearBase,
  SchoolyearPatch,
  SchoolyearRepository,
  SchoolyearSearchQuery,
} from '@repositories/schoolyear';
import { SchoolyearFilter } from '@repositories/schoolyear/filters';
import { SchoolyearValidator } from '@validators/schoolyear';
import {
  EqFilterOperator,
  InFilterOperator,
} from '../../repositories/filters/operators';
import { Paginated } from '../../repositories/search';
import { Services } from '../../server/context/services';
import { getByIdsCachedOrLoad } from '../utils';

export class SchoolyearService {
  constructor(
    private readonly repository: SchoolyearRepository,
    private readonly cache: ObjectCache<Schoolyear>,
    private readonly validator: SchoolyearValidator,
    private readonly services: Services
  ) {}

  async getById(id: string): Promise<Schoolyear | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(Schoolyear | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async create(post: SchoolyearBase): Promise<Schoolyear> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(
    id: string,
    patch: SchoolyearPatch,
    ifRev?: string
  ): Promise<Schoolyear> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<Schoolyear> {
    const res = await this.repository.delete(id, ifRev);

    await Promise.all([
      this.cache.delete(id),

      this.services.level.filterDelete(
        new LevelSchoolyearIdFilter(new EqFilterOperator(id))
      ),
    ]);

    return res;
  }

  async filterDelete(filter: SchoolyearFilter): Promise<Schoolyear[]> {
    const res = await this.repository.filterDelete(filter);

    const schoolyearIds = res.map((r) => r.id);

    await Promise.all([
      this.cache.deleteMany(schoolyearIds),

      await this.services.level.filterDelete(
        new LevelSchoolyearIdFilter(new InFilterOperator(schoolyearIds))
      ),
    ]);

    return res;
  }

  async search(query: SchoolyearSearchQuery): Promise<Paginated<Schoolyear>> {
    return this.repository.search(query);
  }
}
