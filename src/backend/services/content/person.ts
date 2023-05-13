import { WithId } from '#/backend/repositories/arango';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { IdentityTheftPersonIdFilter } from '#/backend/repositories/content/identity-theft/filters';
import {
  PersonBase,
  PersonRepository,
} from '#/backend/repositories/content/person';
import { PersonFilter } from '#/backend/repositories/content/person/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/backend/repositories/filters/operators';
import { Service } from '../base';

export class PersonService extends Service<
  'persons',
  PersonBase,
  PersonRepository
> {
  override async delete(
    id: string,
    ifRev?: string | undefined
  ): Promise<WithId<PersonBase>> {
    const res = await super.delete(id, ifRev);

    await Promise.all([
      this.services.account.filterDelete(
        new AccountPersonIdFilter(new EqFilterOperator(id))
      ),
      this.services.identityTheft.filterDelete(
        new IdentityTheftPersonIdFilter(new EqFilterOperator(id))
      ),
    ]);

    return res;
  }

  override async filterDelete(
    filter: PersonFilter
  ): Promise<WithId<PersonBase>[]> {
    const res = await super.filterDelete(filter);

    const personIds = res.map((r) => r.id);

    await Promise.all([
      this.services.account.filterDelete(
        new AccountPersonIdFilter(new InFilterOperator(personIds))
      ),
      this.services.identityTheft.filterDelete(
        new IdentityTheftPersonIdFilter(new InFilterOperator(personIds))
      ),
    ]);

    return res;
  }
}
