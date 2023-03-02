import { IdDoesNotExistError, MakePatch } from '@repositories/utils';
import { SchoolyearInput, SchoolyearService } from '@services/schoolyear';
import { isNotNullOrUndefined, MissingDependencyError } from '@utils';
import { aggregateValidationErrors, InputValidationError } from './utils';

export const SCHOOLYEAR_START_BEFORE_END = 'SCHOOLYEAR_START_BEFORE_END';
export const SCHOOLYEAR_NAME_EXISTS = 'SCHOOLYEAR_NAME_EXISTS';

export interface SchoolyearValidator {
  setService(service: SchoolyearService): void;
  assertCanCreate(post: SchoolyearInput): Promise<void | never>;
  assertCanUpdate(
    id: string,
    patch: MakePatch<SchoolyearInput>
  ): Promise<void | never>;
}

export class SchoolyearValidatorImpl implements SchoolyearValidator {
  private service: SchoolyearService | null = null;

  setService(service: SchoolyearService): void {
    this.service = service;
  }

  getService(): SchoolyearService {
    if (!this.service) {
      throw new MissingDependencyError('SchoolyearService');
    }

    return this.service;
  }

  async assertCanCreate(post: SchoolyearInput): Promise<void | never> {
    const error = aggregateValidationErrors([
      this.assertStartBeforeEnd(post.start, post.end),
      this.assertExistsNoneWithName(post.name),
    ]);

    if (error) throw error;
  }

  async assertCanUpdate(
    id: string,
    patch: MakePatch<SchoolyearInput>
  ): Promise<void | never> {
    const base = await this.getService().getById(id);

    if (!base) {
      throw new IdDoesNotExistError();
    }

    const error = await aggregateValidationErrors([
      this.assertStartBeforeEnd(
        patch.start ?? base.start,
        patch.end ?? base.end
      ),
      isNotNullOrUndefined(patch.name)
        ? this.assertExistsNoneWithNameExceptId(patch.name, id)
        : null,
    ]);

    if (error) throw error;
  }

  private async assertStartBeforeEnd(
    start: number,
    end: number
  ): Promise<void | never> {
    if (start >= end) {
      throw new InputValidationError(SCHOOLYEAR_START_BEFORE_END);
    }
  }

  private async assertExistsNoneWithName(name: string): Promise<void | never> {
    this.assertExistsNoneWithNameExceptId(name, null);
  }

  private async assertExistsNoneWithNameExceptId(
    name: string,
    id: string | null
  ): Promise<void | never> {
    // TODO: Search service for schoolyear with name and different id and throw error if found
    // throw new InputValidationError(SCHOOLYEAR_NAME_EXISTS);
  }
}
