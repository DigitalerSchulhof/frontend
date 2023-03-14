import { CacheAdapter } from '#/caches/adapters';
import { ObjectCache } from '#/caches/object-cache';
import { Course, CourseRepository } from '#/repositories/content/course';
import { CourseService } from '#/services/content/course';
import { CourseValidator } from '#/validators/content/course';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createCourseService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [CourseRepository, CourseService] {
  const repo = new CourseRepository(db);
  const cache = new ObjectCache<Course>(cacheAdapter, 'courses');
  const validator = new CourseValidator(repositories);

  return [repo, new CourseService(repo, cache, validator)];
}
