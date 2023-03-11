import { LevelBase, LevelPatch } from '@repositories/level';
import { IdNotFoundError } from '../../repositories/utils';
import { Validator } from '../base';
import { SimpleValidator } from '../simple';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const SCHOOLYEAR_DOES_NOT_EXIST = 'SCHOOLYEAR_DOES_NOT_EXIST';
export const LEVEL_NAME_EXISTS = 'LEVEL_NAME_EXISTS';

// TODO: Check name is not empty

export class LevelValidator
  extends Validator
  implements SimpleValidator<LevelBase, LevelPatch>
{
  async assertCanCreate(post: LevelBase): Promise<void | never> {
    await this.assertSchoolyearExists(post.schoolyearId);

    const error = await aggregateValidationErrors([
      this.assertExistsNoneInSchoolyearWithName(post.schoolyearId, post.name),
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
        : this.assertExistsNoneInSchoolyearWithNameExceptId(
            base.schoolyearId,
            patch.name,
            id
          ),
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

  private async assertExistsNoneInSchoolyearWithName(
    schoolyearId: string,
    name: string
  ): Promise<void | never> {
    return this.assertExistsNoneInSchoolyearWithNameExceptId(
      schoolyearId,
      name
    );
  }

  private async assertExistsNoneInSchoolyearWithNameExceptId(
    schoolyearId: string,
    name: string,
    id?: string
  ): Promise<void | never> {
    const level = await this.repositories.level.search({
      filters: {
        name: {
          eq: name,
        },
        schoolyearId: {
          eq: schoolyearId,
        },
        id: {
          ne: id,
        },
      },
      limit: 1,
    });

    if (level.nodes.length) {
      throw new InputValidationError(LEVEL_NAME_EXISTS);
    }
  }
}
