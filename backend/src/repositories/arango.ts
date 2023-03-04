import { Database } from 'arangojs';

export class ArangoRepository {
  constructor(protected readonly db: Database) {}

  protected modelKeyToArangoKey(this: void, key: string): string {
    if (key === 'id') return '_key';
    if (key === 'rev') return '_rev';
    return key;
  }
}
