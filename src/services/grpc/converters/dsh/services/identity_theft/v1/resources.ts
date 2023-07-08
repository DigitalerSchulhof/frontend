import { WithId } from '#/services/interfaces/base';
import * as js from '#/services/interfaces/identity-theft';
import * as grpc from '@dsh/protocols/dsh/services/identity_theft/v1/resources';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';

export function identityTheftToJs(identityTheft: grpc.IdentityTheft): WithId<js.IdentityTheft> {
  return {
    id: identityTheft.id,
    rev: identityTheft.rev,
    updatedAt: timestampToJs(identityTheft.updated_at),
    createdAt: timestampToJs(identityTheft.created_at),
    personId: identityTheft.person_id,
  };
}

export function identityTheftFromJs(
  identityTheft: Partial<WithId<js.IdentityTheft>> | undefined
): grpc.IdentityTheft | undefined {
  if (!identityTheft) return undefined;

  return new grpc.IdentityTheft({
    id: identityTheft.id,
    rev: identityTheft.rev,
    updated_at: timestampFromJs(identityTheft.updatedAt),
    created_at: timestampFromJs(identityTheft.createdAt),
    person_id: identityTheft.personId,
  });
}
