import { WithId } from '#/services/interfaces/base';
import * as js from '#/services/interfaces/class';
import * as grpc from '@dsh/protocols/dsh/services/class/v1/resources';
import {
  timestampFromObject,
  timestampToObject,
} from '../../../../google/protobuf/timestamp';

export function classToObject(clazz: grpc.Class): WithId<js.Class> {
  return {
    id: clazz.id,
    rev: clazz.rev,
    updatedAt: timestampToObject(clazz.updated_at),
    createdAt: timestampToObject(clazz.created_at),
    levelId: clazz.level_id,
    name: clazz.name,
  };
}

export function classFromObject(
  clazz: Partial<WithId<js.Class>> | null | undefined
): grpc.Class | undefined {
  if (!clazz) return undefined;

  return new grpc.Class({
    id: clazz.id,
    rev: clazz.rev,
    updated_at: timestampFromObject(clazz.updatedAt),
    created_at: timestampFromObject(clazz.createdAt),
    level_id: clazz.levelId,
    name: clazz.name,
  });
}
