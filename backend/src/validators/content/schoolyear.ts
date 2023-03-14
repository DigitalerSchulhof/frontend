import { SchoolyearBase } from '#/repositories/content/schoolyear';
import {
  SchoolyearIdFilter,
  SchoolyearNameFilter,
} from '#/repositories/content/schoolyear/filters';
import { IdNotFoundError } from '#/repositories/errors';
import { AndFilter } from '#/repositories/filters';
import {
  EqFilterOperator,
  NeqFilterOperator,
} from '#/repositories/filters/operators';
import { MakePatch } from '#/repositories/utils';
import { Validator } from '../base';
import { aggregateValidationErrors, InputValidationError } from '../utils';

export const SCHOOLYEAR_START_NOT_BEFORE_END =
  'SCHOOLYEAR_START_NOT_BEFORE_END';
export const SCHOOLYEAR_NAME_INVALID = 'SCHOOLYEAR_NAME_INVALID';
export const SCHOOLYEAR_NAME_EXISTS = 'SCHOOLYEAR_NAME_EXISTS';

export class SchoolyearValidator extends Validator<
  'schoolyears',
  SchoolyearBase
> {
  override async assertCanCreate(post: SchoolyearBase): Promise<void | never> {
    const error = await aggregateValidationErrors([
      this.assertStartBeforeEnd(post.start, post.end),
      this.assertNameValid(post.name),
    ]);

    if (error) throw error;
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<SchoolyearBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.schoolyear.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.start === undefined && patch.end === undefined
        ? null
        : this.assertStartBeforeEnd(
            patch.start ?? base.start,
            patch.end ?? base.end
          ),
      patch.name === undefined ? null : this.assertNameValid(patch.name, id),
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

  private async assertNameValid(
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    if (!name.length) {
      throw new InputValidationError(SCHOOLYEAR_NAME_INVALID);
    }

    await this.assertExistsNoneWithName(name, exceptId);
  }

  private async assertExistsNoneWithName(
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    const schoolyears = await this.repositories.schoolyear.search({
      filter: new AndFilter(
        new SchoolyearNameFilter(new EqFilterOperator(name)),
        exceptId === undefined
          ? null
          : new SchoolyearIdFilter(new NeqFilterOperator(exceptId))
      ),
      limit: 1,
    });

    if (schoolyears.nodes.length) {
      throw new InputValidationError(SCHOOLYEAR_NAME_EXISTS);
    }
  }
}
