import { ObjectCache } from '@caches/object-cache';
import { Level, LevelBase, LevelRepository } from '@repositories/level';
import { LevelValidator } from '@validators/level';
import { MakePatch, Paginated } from '../../repositories/utils';
import { getByIdsCachedOrLoad } from '../utils';

export class LevelService {
  constructor(
    private readonly repository: LevelRepository,
    private readonly cache: ObjectCache<Level>,
    private readonly validator: LevelValidator
  ) {
    this.validator.setService(this);
  }

  async getById(id: string): Promise<Level | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(Level | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async getAll(): Promise<Paginated<Level>> {
    return this.repository.getAll();
  }

  async create(post: LevelBase): Promise<Level> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(
    id: string,
    patch: MakePatch<LevelBase>,
    ifRev?: string
  ): Promise<Level> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<Level> {
    const res = this.repository.delete(id, ifRev);

    await this.cache.delete(id);

    return res;
  }
}
