import { ObjectCache } from '@caches/object-cache';
import {
  Schoolyear,
  SchoolyearBase,
  SchoolyearRepository,
} from '@repositories/schoolyear';
import { SchoolyearValidator } from '@validators/schoolyear';
import { MakePatch, Paginated } from '../../repositories/utils';
import { getByIdsCachedOrLoad } from '../utils';

export class SchoolyearService {
  constructor(
    private readonly repository: SchoolyearRepository,
    private readonly cache: ObjectCache<Schoolyear>,
    private readonly validator: SchoolyearValidator
  ) {
    this.validator.setService(this);
  }

  async getById(id: string): Promise<Schoolyear | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(Schoolyear | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async getAll(): Promise<Paginated<Schoolyear>> {
    return this.repository.getAll();
  }

  async create(post: SchoolyearBase): Promise<Schoolyear> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(
    id: string,
    patch: MakePatch<SchoolyearBase>,
    ifRev?: string
  ): Promise<Schoolyear> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<Schoolyear> {
    const res = this.repository.delete(id, ifRev);

    await this.cache.delete(id);

    return res;
  }
}
