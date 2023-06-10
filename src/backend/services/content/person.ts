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
import { TEACHER_CODE_REGEX } from '#/backend/validators/content/person';
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
   * Generate a unique recommendation for the teacher's code of a person given their last name
   *
   * TODO: Make this more sophisticated
   *
   * @returns `null` if no recommendation can be generated
   */
  async generateTeacherCodeSuggestion(base: string): Promise<string | null> {
    if (base.length < 3) return null;

    if (!base.match(TEACHER_CODE_REGEX)) return null;

    let attempt = 1;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- We return when we find a code that's not taken
    while (true) {
      const attemptNr = attempt === 0 ? '' : attempt.toString();

      const code = base + attemptNr;

      const existing = await this.searchOne({
        filter: new PersonTeacherCodeFilter(new EqFilterOperator(code)),
      });

      if (!existing) return code;

      attempt++;
    }
  }
}
