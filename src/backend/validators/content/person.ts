import {
  PersonBase,
  PersonSettings,
} from '#/backend/repositories/content/person';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const MAX_SESSION_TIMEOUT = 300;

export const PERSON_FIRSTNAME_INVALID = 'PERSON_FIRSTNAME_INVALID';
export const PERSON_LASTNAME_INVALID = 'PERSON_LASTNAME_INVALID';
export const PERSON_MAILBOX_DELETE_AFTER_INVALID =
  'PERSON_MAILBOX_DELETE_AFTER_INVALID';
export const PERSON_MAILBOX_DELETE_AFTER_IN_BIN_INVALID =
  'PERSON_MAILBOX_DELETE_AFTER_IN_BIN_INVALID';
export const PERSON_PROFILE_SESSION_TIMEOUT_INVALID =
  'PERSON_PROFILE_SESSION_TIMEOUT_INVALID';

export class PersonValidator extends Validator<'persons', PersonBase> {
  override async assertCanCreate(post: PersonBase): Promise<void | never> {
    await aggregateValidationErrors([
      this.assertFirstnameValid(post.firstname),
      this.assertLastnameValid(post.lastname),
      this.assertSettingsValid(post.settings),
    ]);
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<PersonBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.person.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      patch.firstname === undefined
        ? null
        : this.assertFirstnameValid(patch.firstname),
      patch.lastname === undefined
        ? null
        : this.assertLastnameValid(patch.lastname),
      patch.settings === undefined
        ? null
        : this.assertSettingsValid(patch.settings),
    ]);
  }

  private async assertFirstnameValid(firstname: string): Promise<void | never> {
    if (!firstname.length) {
      throw new InputValidationError(PERSON_FIRSTNAME_INVALID);
    }
  }

  private async assertLastnameValid(lastname: string): Promise<void | never> {
    if (!lastname.length) {
      throw new InputValidationError(PERSON_LASTNAME_INVALID);
    }
  }

  private async assertSettingsValid(
    settings: PersonSettings
  ): Promise<void | never> {
    await aggregateValidationErrors([
      settings.mailbox.deleteAfter !== null &&
      (!Number.isInteger(settings.mailbox.deleteAfter) ||
        settings.mailbox.deleteAfter <= 0)
        ? this.throwValidationError(PERSON_MAILBOX_DELETE_AFTER_INVALID)
        : null,
      settings.mailbox.deleteAfterInBin !== null &&
      (!Number.isInteger(settings.mailbox.deleteAfterInBin) ||
        settings.mailbox.deleteAfterInBin <= 0)
        ? this.throwValidationError(PERSON_MAILBOX_DELETE_AFTER_IN_BIN_INVALID)
        : null,
      !Number.isInteger(settings.profile.sessionTimeout) ||
      settings.profile.sessionTimeout <= 0 ||
      settings.profile.sessionTimeout > MAX_SESSION_TIMEOUT
        ? this.throwValidationError(PERSON_PROFILE_SESSION_TIMEOUT_INVALID)
        : null,
    ]);
  }
}
