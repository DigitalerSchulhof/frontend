import { WithId } from '#/services/interfaces/base';
import * as js from '#/services/interfaces/schoolyear';
import * as grpc from '@dsh/protocols/dsh/services/schoolyear/v1/resources';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';
import { dateFromJs, dateToJs } from '../../../../google/type/date';

export function schoolyearToJs(
  schoolyear: grpc.Schoolyear
): WithId<js.Schoolyear> {
  return {
    id: schoolyear.id,
    rev: schoolyear.rev,
    updatedAt: timestampToJs(schoolyear.updated_at),
    createdAt: timestampToJs(schoolyear.created_at),
    name: schoolyear.name,
    start: dateToJs(schoolyear.start_date),
    end: dateToJs(schoolyear.end_date),
  };
}

export function schoolyearFromJs(
  schoolyear: Partial<WithId<js.Schoolyear>> | undefined
): grpc.Schoolyear | undefined {
  if (!schoolyear) return undefined;

  return new grpc.Schoolyear({
    id: schoolyear.id,
    rev: schoolyear.rev,
    updated_at: timestampFromJs(schoolyear.updatedAt),
    created_at: timestampFromJs(schoolyear.createdAt),
    name: schoolyear.name,
    start_date: dateFromJs(schoolyear.start),
    end_date: dateFromJs(schoolyear.end),
  });
}
