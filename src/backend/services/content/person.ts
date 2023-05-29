import { WithId } from '#/backend/repositories/arango';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { IdentityTheftPersonIdFilter } from '#/backend/repositories/content/identity-theft/filters';
import {
  PersonBase,
  PersonRepository,
} from '#/backend/repositories/content/person';
import {
  PersonFilter,
  PersonTeacherCodeFilter,
} from '#/backend/repositories/content/person/filters';
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

  /**
   * Generate a unique recommendation for the teacher's code of a person
   */
  async generateDefaultTeacherCode(
    person: WithId<PersonBase>
  ): Promise<string> {
    let attempt = 1;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- We return when we find a code that's not taken
    while (true) {
      const attemptNr = attempt === 0 ? '' : attempt.toString();

      const code = person.lastname.substring(0, 3).toUpperCase() + attemptNr;

      const existing = await this.searchOne({
        filter: new PersonTeacherCodeFilter(new EqFilterOperator(code)),
      });

      if (!existing) return code;

      attempt++;
    }
  }
}
