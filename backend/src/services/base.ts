import { ObjectCache } from '#/caches/object-cache';
import { ArangoRepository, WithId } from '#/repositories/arango';
import { Filter } from '#/repositories/filters';
import { MakeSearchQuery, Paginated } from '#/repositories/search';
import { MakePatch } from '#/repositories/utils';
import { Services } from '#/server/context/services';
import { getByIdCachedOrLoad, getByIdsCachedOrLoad } from '#/services/utils';
import { Validator } from '#/validators/base';

export abstract class Service<
  Name extends string,
  Base extends Record<string, string | number | boolean>
> {
  constructor(
    protected readonly repository: ArangoRepository<Name, Base>,
    protected readonly cache: ObjectCache<WithId<Base>>,
    protected readonly validator: Validator<Name, Base>,
    protected readonly services: Services
  ) {}

  async getById(id: string): Promise<WithId<Base> | null> {
    return getByIdCachedOrLoad(this.cache, this.repository, id);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Base> | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async create(post: Base): Promise<WithId<Base>> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(
    id: string,
    patch: MakePatch<Base>,
    ifRev?: string
  ): Promise<WithId<Base>> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<WithId<Base>> {
    const res = await this.repository.delete(id, ifRev);

    await this.cache.delete(id);

    return res;
  }

  async filterDelete(filter: Filter<Name>): Promise<WithId<Base>[]> {
    const res = await this.repository.filterDelete(filter);

    const classIds = res.map((r) => r.id);

    await this.cache.deleteMany(classIds);

    return res;
  }

  async search(query: MakeSearchQuery<Name>): Promise<Paginated<WithId<Base>>> {
    return this.repository.search(query);
  }
}