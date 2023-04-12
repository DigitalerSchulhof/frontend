import { SessionBase } from '#/backend/repositories/content/session';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const ACCOUNT_DOES_NOT_EXIST = 'ACCOUNT_DOES_NOT_EXIST';
export const CANNOT_CHANGE_ACCOUNT_ID = 'CANNOT_CHANGE_ACCOUNT_ID';

export class SessionValidator extends Validator<'sessions', SessionBase> {
  override async assertCanCreate(post: SessionBase): Promise<void | never> {
    await this.assertAccountExists(post.accountId);

    const error = await aggregateValidationErrors([]);

    if (error) throw error;
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<SessionBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.session.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.accountId === undefined || patch.accountId === base.accountId
        ? null
        : this.throwValidationError(CANNOT_CHANGE_ACCOUNT_ID),
    ]);

    if (error) throw error;
  }

  private async assertAccountExists(accountId: string): Promise<void | never> {
    const [schoolyear] = await this.repositories.account.getByIds([accountId]);

    if (!schoolyear) {
      throw new InputValidationError(ACCOUNT_DOES_NOT_EXIST);
    }
  }
}
