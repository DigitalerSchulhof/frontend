import { PersonBase } from '#/backend/repositories/content/person';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const PERSON_FIRSTNAME_INVALID = 'PERSON_FIRSTNAME_INVALID';
export const PERSON_LASTNAME_INVALID = 'PERSON_LASTNAME_INVALID';

export class PersonValidator extends Validator<'persons', PersonBase> {
  override async assertCanCreate(post: PersonBase): Promise<void | never> {
    const error = await aggregateValidationErrors([
      this.assertFirstnameValid(post.firstname),
      this.assertLastnameValid(post.lastname),
    ]);

    if (error) throw error;
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<PersonBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.person.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.firstname === undefined
        ? null
        : this.assertFirstnameValid(patch.firstname),
      patch.lastname === undefined
        ? null
        : this.assertLastnameValid(patch.lastname),
    ]);

    if (error) throw error;
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
}
