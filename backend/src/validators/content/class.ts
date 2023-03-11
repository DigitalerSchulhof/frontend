import { ClassBase, ClassPatch } from '@repositories/class';
import {
  ClassIdFilter,
  ClassLevelIdFilter,
  ClassNameFilter,
} from '@repositories/class/filters';
import { IdNotFoundError } from '../../repositories/errors';
import { AndFilter } from '../../repositories/filters';
import {
  EqFilterOperator,
  NeqFilterOperator,
} from '../../repositories/filters/operators/base';
import { Validator } from '../base';
import { SimpleValidator } from '../simple';
import { aggregateValidationErrors, InputValidationError } from '../utils';

export const LEVEL_DOES_NOT_EXIST = 'LEVEL_DOES_NOT_EXIST';
export const CLASS_NAME_INVALID = 'CLASS_NAME_INVALID';
export const CLASS_NAME_EXISTS = 'CLASS_NAME_EXISTS';

export class ClassValidator
  extends Validator
  implements SimpleValidator<ClassBase, ClassPatch>
{
  async assertCanCreate(post: ClassBase): Promise<void | never> {
    await this.assertLevelExists(post.levelId);

    const error = await aggregateValidationErrors([
      this.assertNameValid(post.levelId, post.name),
    ]);

    if (error) throw error;
  }

  async assertCanUpdate(id: string, patch: ClassPatch): Promise<void | never> {
    const [base] = await this.repositories.class.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    const error = await aggregateValidationErrors([
      patch.name === undefined
        ? null
        : this.assertNameValid(base.levelId, patch.name, id),
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
