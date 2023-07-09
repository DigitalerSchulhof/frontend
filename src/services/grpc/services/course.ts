import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import { Course, CourseService } from '#/services/interfaces/course';
import {
  BatchGetCoursesRequest,
  CourseServiceClient,
  CreateCourseRequest,
  DeleteCourseRequest,
  DeleteCoursesWhereRequest,
  GetCourseRequest,
  ListCoursesRequest,
  UpdateCourseRequest,
  UpdateCoursesWhereRequest,
} from '@dsh/protocols/dsh/services/course/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  courseFromJs,
  courseToJs,
} from '../converters/dsh/services/course/v1/resources';
import { GrpcService, filterToGrpc } from './base';

export class CourseServiceGrpcService
  extends GrpcService<CourseServiceClient>
  implements CourseService
{
  async search(
    options: SearchOptions<Course>
  ): Promise<ListResult<WithId<Course>>> {
    const res = await this.client.ListCourses(
      new ListCoursesRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filterToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.courses.map(courseToJs),
    };
  }

  async get(id: string): Promise<WithId<Course> | null> {
    const res = await this.client.GetCourse(new GetCourseRequest({ id }));

    return courseToJs(res.course);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Course> | null)[]> {
    const res = await this.client.BatchGetCourses(
      new BatchGetCoursesRequest({ ids })
    );

    return res.courses.map(courseToJs);
  }

  async create(data: Course): Promise<WithId<Course>> {
    const res = await this.client.CreateCourse(
      new CreateCourseRequest({
        data: courseFromJs(data),
      })
    );

    return courseToJs(res.course);
  }

  async update(id: string, data: Partial<Course>): Promise<WithId<Course>> {
    const res = await this.client.UpdateCourse(
      new UpdateCourseRequest({
        id,
        data: courseFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return courseToJs(res.course);
  }

  async updateWhere(
    filter: TypeFilter<Course>,
    data: Partial<Course>
  ): Promise<WithId<Course>[]> {
    const res = await this.client.UpdateCoursesWhere(
      new UpdateCoursesWhereRequest({
        filter: filterToGrpc(filter),
        data: courseFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.courses.map(courseToJs);
  }

  async delete(id: string): Promise<WithId<Course>> {
    const res = await this.client.DeleteCourse(new DeleteCourseRequest({ id }));

    return courseToJs(res.course);
  }

  async deleteWhere(filter: TypeFilter<Course>): Promise<WithId<Course>[]> {
    const res = await this.client.DeleteCoursesWhere(
      new DeleteCoursesWhereRequest({
        filter: filterToGrpc(filter),
      })
    );

    return res.courses.map(courseToJs);
  }
}
