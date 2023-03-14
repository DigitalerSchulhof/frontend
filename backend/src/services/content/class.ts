import { ObjectCache } from '#/caches/object-cache';
import {
  Class,
  ClassBase,
  ClassPatch,
  ClassRepository,
  ClassSearchQuery,
} from '#/repositories/content/class';
import { ClassFilter } from '#/repositories/content/class/filters';
import { CourseClassIdFilter } from '#/repositories/content/course/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/repositories/filters/operators';
import { Paginated } from '#/repositories/search';
import { Services } from '#/server/context/services';
import { ClassValidator } from '#/validators/content/class';
import { getByIdsCachedOrLoad } from '../utils';

export class ClassService {
  constructor(
    private readonly repository: ClassRepository,
    private readonly cache: ObjectCache<Class>,
    private readonly validator: ClassValidator,
    private readonly services: Services
  ) {}

  async getById(id: string): Promise<Class | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(Class | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async create(post: ClassBase): Promise<Class> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(id: string, patch: ClassPatch, ifRev?: string): Promise<Class> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<Class> {
    const res = await this.repository.delete(id, ifRev);

    await Promise.all([
      this.cache.delete(id),

      this.services.course.filterDelete(
        new CourseClassIdFilter(new EqFilterOperator(id))
      ),
    ]);

    return res;
  }

  async filterDelete(filter: ClassFilter): Promise<Class[]> {
    const res = await this.repository.filterDelete(filter);

    const classIds = res.map((r) => r.id);

    await Promise.all([
      this.cache.deleteMany(classIds),

      await this.services.course.filterDelete(
        new CourseClassIdFilter(new InFilterOperator(classIds))
      ),
    ]);

    return res;
  }

  async search(query: ClassSearchQuery): Promise<Paginated<Class>> {
    return this.repository.search(query);
  }
}
