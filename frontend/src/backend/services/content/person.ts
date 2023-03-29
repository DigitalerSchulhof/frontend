import { WithId } from '#/backend/repositories/arango';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { PersonBase } from '#/backend/repositories/content/person';
import { PersonFilter } from '#/backend/repositories/content/person/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/backend/repositories/filters/operators';
import { Service } from '../base';

export class PersonService extends Service<'persons', PersonBase> {
  override async delete(
    id: string,
    ifRev?: string | undefined
  ): Promise<WithId<PersonBase>> {
    const res = await super.delete(id, ifRev);

    await this.services.account.filterDelete(
      new AccountPersonIdFilter(new EqFilterOperator(id))
    );

    return res;
  }

  override async filterDelete(
    filter: PersonFilter
  ): Promise<WithId<PersonBase>[]> {
    const res = await super.filterDelete(filter);

    const personIds = res.map((r) => r.id);

    await this.services.account.filterDelete(
      new AccountPersonIdFilter(new InFilterOperator(personIds))
    );

    return res;
  }
}
