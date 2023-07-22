import type { WithId } from '#/services/interfaces/base';
import type * as js from '#/services/interfaces/level';
import * as grpc from '@dsh/protocols/dsh/services/level/v1/resources';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';

export function levelToJs(level: grpc.Level): WithId<js.Level> {
  return {
    id: level.id,
    rev: level.rev,
    updatedAt: timestampToJs(level.updated_at),
    createdAt: timestampToJs(level.created_at),
    schoolyearId: level.schoolyear_id,
    name: level.name,
  };
}

export function levelFromJs(
  level: Partial<WithId<js.Level>> | undefined
): grpc.Level | undefined {
  if (!level) return undefined;

  return new grpc.Level({
    id: level.id,
    rev: level.rev,
    updated_at: timestampFromJs(level.updatedAt),
    created_at: timestampFromJs(level.createdAt),
    schoolyear_id: level.schoolyearId,
    name: level.name,
  });
}
