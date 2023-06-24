import { GrpcService } from '#/services/grpc/services/base';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import { Course, CourseService } from '#/services/interfaces/course';
import { CourseServiceClient } from '@dsh/protocols/dsh/services/course/v1/service';

export class CourseServiceGrpcService
  extends GrpcService<CourseServiceClient>
  implements CourseService
{
  search(options: ListOptions): Promise<ListResult<WithId<Course>>> {
    throw new Error('Method not implemented.');
  }

  get(id: string): Promise<WithId<Course> | null> {
    throw new Error('Method not implemented.');
  }

  getByIds(ids: readonly string[]): Promise<(WithId<Course> | null)[]> {
    throw new Error('Method not implemented.');
  }

  create(data: Course): Promise<WithId<Course>> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<Course>): Promise<WithId<Course>> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<WithId<Course>> {
    throw new Error('Method not implemented.');
  }
}
