import { WithId } from '#/services/interfaces/base';
import * as js from '#/services/interfaces/class';
import * as grpc from '@dsh/protocols/dsh/services/class/v1/resources';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';

export function classToJs(clazz: grpc.Class): WithId<js.Class> {
  return {
    id: clazz.id,
    rev: clazz.rev,
    updatedAt: timestampToJs(clazz.updated_at),
    createdAt: timestampToJs(clazz.created_at),
    levelId: clazz.level_id,
    name: clazz.name,
  };
}

export function classFromJs(
  clazz: Partial<WithId<js.Class>> | undefined
): grpc.Class | undefined {
  if (!clazz) return undefined;

  return new grpc.Class({
    id: clazz.id,
    rev: clazz.rev,
    updated_at: timestampFromJs(clazz.updatedAt),
    created_at: timestampFromJs(clazz.createdAt),
    level_id: clazz.levelId,
    name: clazz.name,
  });
}
