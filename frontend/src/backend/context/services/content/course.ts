import { CacheAdapter } from '#/backend/caches/adapters';
import { ObjectCache } from '#/backend/caches/object-cache';
import { WithId } from '#/backend/repositories/arango';
import {
  CourseBase,
  CourseRepository,
} from '#/backend/repositories/content/course';
import { CourseService } from '#/backend/services/content/course';
import { CourseValidator } from '#/backend/validators/content/course';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createCourseService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [CourseRepository, CourseService] {
  const repo = new CourseRepository(db);
  const cache = new ObjectCache<WithId<CourseBase>>(cacheAdapter, 'courses');
  const validator = new CourseValidator(repositories);

  return [repo, new CourseService(repo, cache, validator, services)];
}
