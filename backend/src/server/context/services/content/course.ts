import { CacheAdapter } from '@caches/adapters';
import { ObjectCache } from '@caches/object-cache';
import {
  Course,
  CourseRepository,
  CourseRepositoryImpl,
} from '@repositories/course';
import { CourseService } from '@services/course';
import { CourseValidator } from '@validators/course';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createCourseService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [CourseRepository, CourseService] {
  const repo = new CourseRepositoryImpl(db);
  const cache = new ObjectCache<Course>(cacheAdapter, 'courses');
  const validator = new CourseValidator(repositories);

  return [repo, new CourseService(repo, cache, validator)];
}
