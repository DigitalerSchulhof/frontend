import {
  AndFilter,
  OrFilter,
  type ListResult,
  type SearchOptions,
  type TypeFilter,
  type WithId,
} from '#/services/interfaces/base';
import type { Course, CourseService } from '#/services/interfaces/course';
import type { CourseServiceClient } from '@dsh/protocols/dsh/services/course/v1/service';
import {
  BatchGetCoursesRequest,
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
import { GrpcService } from './base';

export class GrpcCourseService
  extends GrpcService<CourseServiceClient>
  implements CourseService
{
  async search(
    options: SearchOptions<WithId<Course>>
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

  async update(
    id: string,
    data: Partial<Course>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Course>> {
    const res = await this.client.UpdateCourse(
      new UpdateCourseRequest({
        id,
        data: courseFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
        if_rev: options?.ifRev,
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

  async delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Course>> {
    const res = await this.client.DeleteCourse(
      new DeleteCourseRequest({ id, if_rev: options?.ifRev })
    );

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

function filterToGrpc(
  filter: TypeFilter<Course> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<Course> | undefined
): object | undefined {
  if (!filter) return undefined;

  if (filter instanceof AndFilter) {
    return {
      and: filter.filters.map(filterToGrpcWorker),
    };
  }

  if (filter instanceof OrFilter) {
    return {
      or: filter.filters.map(filterToGrpcWorker),
    };
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
      return { property: 'id', operator, value };
    case 'rev':
      return { property: 'rev', operator, value };
    case 'updatedAt':
      return { property: 'updated_at', operator, value };
    case 'createdAt':
      return { property: 'created_at', operator, value };
    case 'classId':
      return { property: 'class_id', operator, value };
    case 'name':
      return { property: 'name', operator, value };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
