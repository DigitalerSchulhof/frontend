import { WithId } from '#/services/interfaces/base';
import * as js from '#/services/interfaces/session';
import * as grpc from '@dsh/protocols/dsh/services/session/v1/resources';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';

export function sessionToJs(session: grpc.Session): WithId<js.Session> {
  return {
    id: session.id,
    rev: session.rev,
    updatedAt: timestampToJs(session.updated_at),
    createdAt: timestampToJs(session.created_at),
    personId: session.person_id,
    issuedAt: timestampToJs(session.issued_at),
    didShowLastLogin: session.did_show_last_login,
  };
}

export function sessionFromJs(
  session: Partial<WithId<js.Session>> | undefined
): grpc.Session | undefined {
  if (!session) return undefined;

  return new grpc.Session({
    id: session.id,
    rev: session.rev,
    updated_at: timestampFromJs(session.updatedAt),
    created_at: timestampFromJs(session.createdAt),
    person_id: session.personId,
    issued_at: timestampFromJs(session.issuedAt),
    did_show_last_login: session.didShowLastLogin,
  });
}
