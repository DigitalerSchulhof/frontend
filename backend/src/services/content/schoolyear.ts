import { ObjectCache } from '@caches/object-cache';
import {
  Schoolyear as RSchoolyear,
  SchoolyearBase as RSchoolyearBase,
  SchoolyearPatch as RSchoolyearPatch,
  SchoolyearRepository as RSchoolyearRepository,
  SchoolyearSearchQuery as RSchoolyearSearchQuery,
} from '@repositories/schoolyear';
import { SchoolyearValidator } from '@validators/schoolyear';
import { Paginated } from '../../repositories/search';
import { getByIdsCachedOrLoad } from '../utils';

export interface SchoolyearBase {}

export class SchoolyearService {
  constructor(
    private readonly repository: RSchoolyearRepository,
    private readonly cache: ObjectCache<RSchoolyear>,
    private readonly validator: SchoolyearValidator
  ) {}

  async getById(id: string): Promise<RSchoolyear | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(RSchoolyear | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async create(post: RSchoolyearBase): Promise<RSchoolyear> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(
    id: string,
    patch: RSchoolyearPatch,
    ifRev?: string
  ): Promise<RSchoolyear> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<RSchoolyear> {
    const res = this.repository.delete(id, ifRev);

    await this.cache.delete(id);

    return res;
  }

  async search(query: RSchoolyearSearchQuery): Promise<Paginated<RSchoolyear>> {
    return this.repository.search(query);
  }
}
