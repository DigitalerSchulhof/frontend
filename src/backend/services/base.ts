import { ObjectCache } from '#/backend/caches/object-cache';
import {
  ArangoRepository,
  Serializable,
  WithId,
} from '#/backend/repositories/arango';
import { Filter } from '#/backend/repositories/filters';
import { MakeSearchQuery, Paginated } from '#/backend/repositories/search';
import { MakePatch } from '#/backend/repositories/utils';
import {
  getByIdCachedOrLoad,
  getByIdsCachedOrLoad,
} from '#/backend/services/utils';
import { Validator } from '#/backend/validators/base';
import { Services } from '#/context/services';

export abstract class Service<
  Name extends string,
  Base extends Record<string, Serializable>,
  Repository extends ArangoRepository<Name, Base>
> {
  constructor(
    protected readonly repository: Repository,
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
    options: {
      ifRev?: string;
      skipValidation?: boolean;
    } = {}
  ): Promise<WithId<Base>> {
    const { ifRev, skipValidation = false } = options;

    if (!skipValidation) {
      await this.validator.assertCanUpdate(id, patch);
    }

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

  async searchOne(query: MakeSearchQuery<Name>): Promise<WithId<Base> | null> {
    return this.repository.searchOne(query);
  }
}
