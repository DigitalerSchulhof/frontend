/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any */
import { ObjectCache } from '../caches/object-cache';
import { AnonymousSearchQuery, Paginated } from '../repositories/search';
import {
  ExtractRepositoryArgs,
  SimpleRepository,
} from '../repositories/simple';
import { SimpleValidator } from '../validators/simple';
import { getByIdsCachedOrLoad } from './utils';

export class SimpleService<
  Repository extends SimpleRepository<any, any, any, any>,
  BaseWithId extends Record<
    string,
    string | number | boolean
  > = ExtractRepositoryArgs<Repository>[0],
  Base extends Record<
    string,
    string | number | boolean
  > = ExtractRepositoryArgs<Repository>[1],
  Patch extends Record<
    string,
    string | number | boolean
  > = ExtractRepositoryArgs<Repository>[2],
  SearchQuery extends AnonymousSearchQuery = ExtractRepositoryArgs<Repository>[3],
  Validator extends SimpleValidator<any, any> = SimpleValidator<Base, Patch>
> {
  constructor(
    private readonly repository: Repository,
    private readonly cache: ObjectCache<BaseWithId>,
    private readonly validator: Validator
  ) {}

  async getById(id: string): Promise<BaseWithId | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(BaseWithId | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async getAll(): Promise<Paginated<BaseWithId>> {
    return this.repository.getAll();
  }

  async create(post: Base): Promise<BaseWithId> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(id: string, patch: Patch, ifRev?: string): Promise<BaseWithId> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<BaseWithId> {
    const res = this.repository.delete(id, ifRev);

    await this.cache.delete(id);

    return res;
  }

  async search(query: SearchQuery): Promise<Paginated<BaseWithId>> {
    return this.repository.search(query);
  }
}
