import { IdentityTheftBase } from '#/backend/repositories/content/identity-theft';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const MAX_SESSION_TIMEOUT = 300;

export const PERSON_DOES_NOT_EXIST = 'PERSON_DOES_NOT_EXIST';
export const CANNOT_CHANGE_PERSON_ID = 'CANNOT_CHANGE_PERSON_ID';

export class IdentityTheftValidator extends Validator<
  'identity-thefts',
  IdentityTheftBase
> {
  override async assertCanCreate(
    post: IdentityTheftBase
  ): Promise<void | never> {
    await this.assertPersonExists(post.personId);

    await aggregateValidationErrors([]);
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<IdentityTheftBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.identityTheft.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      patch.personId === undefined || patch.personId === base.personId
        ? null
        : this.throwValidationError(CANNOT_CHANGE_PERSON_ID),
    ]);
  }

  private async assertPersonExists(personId: string): Promise<void | never> {
    const [schoolyear] = await this.repositories.person.getByIds([personId]);

    if (!schoolyear) {
      throw new InputValidationError(PERSON_DOES_NOT_EXIST);
    }
  }
}
