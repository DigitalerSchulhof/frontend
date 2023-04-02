import { ArangoRepository } from '../../arango';

export type SessionBase = {
  personId: string;
  iat: number;
};

export class SessionRepository extends ArangoRepository<
  'sessions',
  SessionBase
> {
  protected readonly collectionName = 'sessions';
}
