import { Database } from 'arangojs';

export class ArangoRepository {
  constructor(protected readonly db: Database) {}
}
