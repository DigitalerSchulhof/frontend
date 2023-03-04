import { SchoolyearBase, SchoolyearPatch } from '@repositories/schoolyear';
import { IdNotFoundError } from '../../repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const SCHOOLYEAR_START_NOT_BEFORE_END =
  'SCHOOLYEAR_START_NOT_BEFORE_END';
export const SCHOOLYEAR_NAME_EXISTS = 'SCHOOLYEAR_NAME_EXISTS';

export class SchoolyearValidator extends Validator {
  async assertCanCreate(post: SchoolyearBase): Promise<void | never> {
    const error = await aggregateValidationErrors([
      this.assertStartBeforeEnd(post.start, post.end),
      this.assertExistsNoneWithName(post.name),
    ]);

    if (error) throw error;
  }

  async assertCanUpdate(
    id: string,
    patch: SchoolyearPatch
  ): Promise<void | never> {
    const [base] = await this.repositories.schoolyear.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      this.assertStartBeforeEnd(
        patch.start ?? base.start,
        patch.end ?? base.end
      ),
      patch.name === undefined
        ? null
        : this.assertExistsNoneWithNameExceptId(patch.name, id),
    ]);

    if (error) throw error;
  }

  private async assertStartBeforeEnd(
    start: number,
    end: number
  ): Promise<void | never> {
    if (start >= end) {
      throw new InputValidationError(SCHOOLYEAR_START_NOT_BEFORE_END);
    }
  }

  private async assertExistsNoneWithName(name: string): Promise<void | never> {
    return this.assertExistsNoneWithNameExceptId(name);
  }

  private async assertExistsNoneWithNameExceptId(
    name: string,
    id?: string
  ): Promise<void | never> {
    const schoolyears = await this.repositories.schoolyear.search({
      filters: {
        name: {
          eq: name,
        },
        id: {
          neq: id,
        },
      },
      limit: 1,
    });

    if (schoolyears.nodes.length) {
      throw new InputValidationError(SCHOOLYEAR_NAME_EXISTS);
    }
  }
}
