import { WithId } from '#/services/interfaces/base';
import * as js from '#/services/interfaces/course';
import * as grpc from '@dsh/protocols/dsh/services/course/v1/resources';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';

export function courseToJs(course: grpc.Course): WithId<js.Course> {
  return {
    id: course.id,
    rev: course.rev,
    updatedAt: timestampToJs(course.updated_at),
    createdAt: timestampToJs(course.created_at),
    classId: course.class_id,
    name: course.name,
  };
}

export function courseFromJs(
  course: Partial<WithId<js.Course>> | undefined
): grpc.Course | undefined {
  if (!course) return undefined;

  return new grpc.Course({
    id: course.id,
    rev: course.rev,
    updated_at: timestampFromJs(course.updatedAt),
    created_at: timestampFromJs(course.createdAt),
    class_id: course.classId,
    name: course.name,
  });
}
