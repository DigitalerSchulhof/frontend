import { LevelBase } from '#/backend/repositories/content/level';
import {
  LevelIdFilter,
  LevelNameFilter,
  LevelSchoolyearIdFilter,
} from '#/backend/repositories/content/level/filters';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { AndFilter } from '#/backend/repositories/filters';
import {
  EqFilterOperator,
  NeqFilterOperator,
} from '#/backend/repositories/filters/operators';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import {
  AggregatedInputValidationError,
  InputValidationError,
  aggregateValidationErrors,
} from '../utils';

export const SCHOOLYEAR_DOES_NOT_EXIST = 'SCHOOLYEAR_DOES_NOT_EXIST';
export const LEVEL_NAME_INVALID = 'LEVEL_NAME_INVALID';
export const LEVEL_NAME_EXISTS = 'LEVEL_NAME_EXISTS';
export const CANNOT_CHANGE_SCHOOLYEAR_ID = 'CANNOT_CHANGE_SCHOOLYEAR_ID';

export class LevelValidator extends Validator<'levels', LevelBase> {
  override async assertCanCreate(post: LevelBase): Promise<void | never> {
    await this.assertSchoolyearExists(post.schoolyearId);

    const error = await aggregateValidationErrors([
      this.assertNameValid(post.schoolyearId, post.name),
    ]);

    if (error) throw error;
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<LevelBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.level.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.name === undefined
        ? null
        : this.assertNameValid(base.schoolyearId, patch.name, id),
      patch.schoolyearId === undefined ||
      patch.schoolyearId === base.schoolyearId
        ? null
        : this.throwValidationError(CANNOT_CHANGE_SCHOOLYEAR_ID),
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
      throw new AggregatedInputValidationError([
        new InputValidationError(SCHOOLYEAR_DOES_NOT_EXIST),
      ]);
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
