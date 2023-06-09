import { PersonBase } from '#/backend/repositories/content/person';
import { PersonTeacherCodeFilter } from '#/backend/repositories/content/person/filters';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const ACCOUNT_DOES_NOT_EXIST = 'ACCOUNT_DOES_NOT_EXIST';

export const PERSON_FIRSTNAME_INVALID = 'PERSON_FIRSTNAME_INVALID';
export const PERSON_LASTNAME_INVALID = 'PERSON_LASTNAME_INVALID';
export const PERSON_TYPE_TEACHER_CODE_MISMATCH =
  'PERSON_TYPE_TEACHER_CODE_MISMATCH';
export const PERSON_TEACHER_CODE_INVALID = 'PERSON_TEACHER_CODE_INVALID';
export const PERSON_TEACHER_CODE_EXISTS = 'PERSON_TEACHER_CODE_EXISTS';

export const TEACHER_CODE_REGEX = /^[A-Z0-9]{2,}$/;

export class PersonValidator extends Validator<'persons', PersonBase> {
  override async assertCanCreate(post: PersonBase): Promise<void | never> {
    if (post.accountId !== null) {
      await this.assertAccountExists(post.accountId);
    }

    await aggregateValidationErrors([
      this.assertFirstnameValid(post.firstname),
      this.assertLastnameValid(post.lastname),
      this.assertTeacherCodeValid(post.type, post.teacherCode),
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
      patch.type === base.type && patch.teacherCode === base.teacherCode
        ? null
        : this.assertTeacherCodeValid(
            patch.type ?? base.type,
            patch.teacherCode ?? base.teacherCode
          ),
    ]);
  }

  private async assertAccountExists(accountId: string): Promise<void | never> {
    const account = await this.repositories.person.getById(accountId);

    if (!account) {
      throw new InputValidationError(ACCOUNT_DOES_NOT_EXIST);
    }
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

  private async assertTeacherCodeValid(
    type: PersonBase['type'],
    teacherCode: PersonBase['teacherCode']
  ): Promise<void | never> {
    if ((type === 'teacher') !== (teacherCode !== null)) {
      throw new InputValidationError(PERSON_TYPE_TEACHER_CODE_MISMATCH);
    }

    if (teacherCode !== null && TEACHER_CODE_REGEX.exec(teacherCode)) {
      throw new InputValidationError(PERSON_TEACHER_CODE_INVALID);
    }

    if (teacherCode !== null) {
      const teacherCodeExists = await this.repositories.person.searchOne({
        filter: new PersonTeacherCodeFilter(new EqFilterOperator(teacherCode)),
      });

      if (teacherCodeExists) {
        throw new InputValidationError(PERSON_TEACHER_CODE_EXISTS);
      }
    }
  }
}
