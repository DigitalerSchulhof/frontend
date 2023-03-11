import { LevelBase, LevelPatch } from '@repositories/level';
import {
  LevelIdFilter,
  LevelNameFilter,
  LevelSchoolyearIdFilter,
} from '@repositories/level/filters';
import { IdNotFoundError } from '../../repositories/errors';
import { AndFilter } from '../../repositories/filters';
import {
  EqFilterOperator,
  NeqFilterOperator,
} from '../../repositories/filters/operators';
import { Validator } from '../base';
import { SimpleValidator } from '../simple';
import { aggregateValidationErrors, InputValidationError } from '../utils';

export const SCHOOLYEAR_DOES_NOT_EXIST = 'SCHOOLYEAR_DOES_NOT_EXIST';
export const LEVEL_NAME_INVALID = 'LEVEL_NAME_INVALID';
export const LEVEL_NAME_EXISTS = 'LEVEL_NAME_EXISTS';

export class LevelValidator
  extends Validator
  implements SimpleValidator<LevelBase, LevelPatch>
{
  async assertCanCreate(post: LevelBase): Promise<void | never> {
    await this.assertSchoolyearExists(post.schoolyearId);

    const error = await aggregateValidationErrors([
      this.assertNameValid(post.schoolyearId, post.name),
    ]);

    if (error) throw error;
  }

  async assertCanUpdate(id: string, patch: LevelPatch): Promise<void | never> {
    const [base] = await this.repositories.level.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.name === undefined
        ? null
        : this.assertNameValid(base.schoolyearId, patch.name, id),
    ]);

    if (error) throw error;
  }

  private async assertSchoolyearExists(
    schoolyearId: string
  ): Promise<void | never> {
    const [schoolyear] = await this.repositories.schoolyear.getByIds([
      schoolyearId,
    ]);

    if (!schoolyear) {
      throw new InputValidationError(SCHOOLYEAR_DOES_NOT_EXIST);
    }
  }

  private async assertNameValid(
    schoolyearId: string,
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    if (!name.length) {
      throw new InputValidationError(LEVEL_NAME_INVALID);
    }

    await this.assertExistsNoneInSchoolyearWithName(
      schoolyearId,
      name,
      exceptId
    );
  }

  private async assertExistsNoneInSchoolyearWithName(
    schoolyearId: string,
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    const level = await this.repositories.level.search({
      filter: new AndFilter(
        new LevelNameFilter(new EqFilterOperator(name)),
        new LevelSchoolyearIdFilter(new EqFilterOperator(schoolyearId)),
        exceptId === undefined
          ? null
          : new LevelIdFilter(new NeqFilterOperator(exceptId))
      ),
      limit: 1,
    });

    if (level.nodes.length) {
      throw new InputValidationError(LEVEL_NAME_EXISTS);
    }
  }
}
