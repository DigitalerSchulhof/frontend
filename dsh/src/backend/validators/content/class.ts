import { ClassBase } from '#/backend/repositories/content/class';
import {
  ClassIdFilter,
  ClassLevelIdFilter,
  ClassNameFilter,
} from '#/backend/repositories/content/class/filters';
import { IdNotFoundError } from '#/backend/repositories/errors';
import { AndFilter } from '#/backend/repositories/filters';
import {
  EqFilterOperator,
  NeqFilterOperator,
} from '#/backend/repositories/filters/operators';
import { MakePatch } from '#/backend/repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const LEVEL_DOES_NOT_EXIST = 'LEVEL_DOES_NOT_EXIST';
export const CLASS_NAME_INVALID = 'CLASS_NAME_INVALID';
export const CLASS_NAME_EXISTS = 'CLASS_NAME_EXISTS';
export const CANNOT_CHANGE_LEVEL_ID = 'CANNOT_CHANGE_LEVEL_ID';

export class ClassValidator extends Validator<'classes', ClassBase> {
  override async assertCanCreate(post: ClassBase): Promise<void | never> {
    await this.assertLevelExists(post.levelId);

    const error = await aggregateValidationErrors([
      this.assertNameValid(post.levelId, post.name),
    ]);

    if (error) throw error;
  }

  override async assertCanUpdate(
    id: string,
    patch: MakePatch<ClassBase>
  ): Promise<void | never> {
    const [base] = await this.repositories.class.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.name === undefined
        ? null
        : this.assertNameValid(base.levelId, patch.name, id),
      patch.levelId === undefined
        ? null
        : this.throwValidationError(CANNOT_CHANGE_LEVEL_ID),
    ]);

    if (error) throw error;
  }

  private async assertLevelExists(levelId: string): Promise<void | never> {
    const [level] = await this.repositories.level.getByIds([levelId]);

    if (!level) {
      throw new InputValidationError(LEVEL_DOES_NOT_EXIST);
    }
  }

  private async assertNameValid(
    levelId: string,
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    if (!name.length) {
      throw new InputValidationError(CLASS_NAME_INVALID);
    }

    await this.assertExistsNoneInLevelWithName(levelId, name, exceptId);
  }

  private async assertExistsNoneInLevelWithName(
    levelId: string,
    name: string,
    exceptId?: string
  ): Promise<void | never> {
    const clazz = await this.repositories.class.search({
      filter: new AndFilter(
        new ClassNameFilter(new EqFilterOperator(name)),
        new ClassLevelIdFilter(new EqFilterOperator(levelId)),
        exceptId === undefined
          ? null
          : new ClassIdFilter(new NeqFilterOperator(exceptId))
      ),
      limit: 1,
    });

    if (clazz.nodes.length) {
      throw new InputValidationError(CLASS_NAME_EXISTS);
    }
  }
}
