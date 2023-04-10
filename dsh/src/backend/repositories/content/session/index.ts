import { ArangoRepository } from '../../arango';

export type SessionBase = {
  accountId: string;
  iat: number;
  didShowLastLogin: boolean;
};

export class SessionRepository extends ArangoRepository<
  'sessions',
  SessionBase
> {
  protected readonly collectionName = 'sessions';
}
