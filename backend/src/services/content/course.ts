import { ObjectCache } from '@caches/object-cache';
import {
  Course,
  CourseBase,
  CoursePatch,
  CourseRepository,
  CourseSearchQuery,
} from '@repositories/course';
import { CourseFilter } from '@repositories/course/filters';
import { CourseValidator } from '@validators/course';
import { Paginated } from '../../repositories/search';
import { getByIdsCachedOrLoad } from '../utils';

export class CourseService {
  constructor(
    private readonly repository: CourseRepository,
    private readonly cache: ObjectCache<Course>,
    private readonly validator: CourseValidator
  ) {}

  async getById(id: string): Promise<Course | null> {
    return (await this.getByIds([id]))[0];
  }

  async getByIds(ids: readonly string[]): Promise<(Course | null)[]> {
    return getByIdsCachedOrLoad(this.cache, this.repository, ids);
  }

  async create(post: CourseBase): Promise<Course> {
    await this.validator.assertCanCreate(post);

    const res = await this.repository.create(post);

    await this.cache.set(res.id, res);

    return res;
  }

  async update(
    id: string,
    patch: CoursePatch,
    ifRev?: string
  ): Promise<Course> {
    await this.validator.assertCanUpdate(id, patch);

    const res = await this.repository.update(id, patch, ifRev);

    await this.cache.set(res.id, res);

    return res;
  }

  async delete(id: string, ifRev?: string): Promise<Course> {
    const res = await this.repository.delete(id, ifRev);

    await this.cache.delete(id);

    return res;
  }

  async filterDelete(filter: CourseFilter): Promise<Course[]> {
    const res = await this.repository.filterDelete(filter);

    const courseIds = res.map((r) => r.id);

    await this.cache.deleteMany(courseIds);

    return res;
  }

  async search(query: CourseSearchQuery): Promise<Paginated<Course>> {
    return this.repository.search(query);
  }
}
