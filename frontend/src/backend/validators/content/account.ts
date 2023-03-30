import { AccountBase } from '#/backend/repositories/content/account';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const PERSON_DOES_NOT_EXIST = 'PERSON_DOES_NOT_EXIST';
export const CANNOT_CHANGE_PERSON_ID = 'CANNOT_CHANGE_PERSON_ID';

export class AccountValidator extends Validator<'accounts', AccountBase> {
  override async assertCanCreate(post: AccountBase): Promise<void | never> {
    await this.assertPersonExists(post.personId);

    const error = await aggregateValidationErrors([]);

    if (error) throw error;
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<AccountBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.account.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.personId === undefined
        ? null
        : this.throwValidationError(CANNOT_CHANGE_PERSON_ID),
    ]);

    if (error) throw error;
  }

  private async assertPersonExists(personId: string): Promise<void | never> {
    const [schoolyear] = await this.repositories.person.getByIds([personId]);

    if (!schoolyear) {
      throw new InputValidationError(PERSON_DOES_NOT_EXIST);
    }
  }
}
