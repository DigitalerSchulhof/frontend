import {
  AccountBase,
  AccountSettings,
} from '#/backend/repositories/content/account';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const MAX_SESSION_TIMEOUT = 300;

export const PERSON_DOES_NOT_EXIST = 'PERSON_DOES_NOT_EXIST';

export const ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID =
  'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID';
export const ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID =
  'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID';
export const ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID =
  'ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID';

export class AccountValidator extends Validator<'accounts', AccountBase> {
  override async assertCanCreate(post: AccountBase): Promise<void | never> {
    await this.assertPersonExists(post.personId);

    await aggregateValidationErrors([this.assertSettingsValid(post.settings)]);
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<AccountBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.account.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      patch.settings === undefined
        ? null
        : this.assertSettingsValid(patch.settings),
    ]);
  }

  private async assertPersonExists(personId: string): Promise<void | never> {
    const [person] = await this.repositories.person.getByIds([personId]);

    if (!person) {
      throw new InputValidationError(PERSON_DOES_NOT_EXIST);
    }
  }

  private async assertSettingsValid(
    settings: AccountSettings
  ): Promise<void | never> {
    await aggregateValidationErrors([
      settings.mailbox.deleteAfter !== null &&
      (!Number.isInteger(settings.mailbox.deleteAfter) ||
        settings.mailbox.deleteAfter <= 0)
        ? this.throwValidationError(
            ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID
          )
        : null,
      settings.mailbox.deleteAfterInBin !== null &&
      (!Number.isInteger(settings.mailbox.deleteAfterInBin) ||
        settings.mailbox.deleteAfterInBin <= 0)
        ? this.throwValidationError(
            ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID
          )
        : null,
      !Number.isInteger(settings.profile.sessionTimeout) ||
      settings.profile.sessionTimeout <= 0 ||
      settings.profile.sessionTimeout > MAX_SESSION_TIMEOUT
        ? this.throwValidationError(
            ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID
          )
        : null,
    ]);
  }
}
