import { LevelBase, LevelPatch } from '@repositories/level';
import { IdNotFoundError } from '../../repositories/utils';
import { Validator } from '../base';
import { InputValidationError, aggregateValidationErrors } from '../utils';

export const SCHOOLYEAR_DOES_NOT_EXIST = 'SCHOOLYEAR_DOES_NOT_EXIST';
export const LEVEL_NAME_EXISTS = 'LEVEL_NAME_EXISTS';

export class LevelValidator extends Validator {
  async assertCanCreate(post: LevelBase): Promise<void | never> {
    await this.assertSchoolyearExists(post.schoolyearId);

    const error = await aggregateValidationErrors([
      this.assertExistsNoneInSchoolyearWithName(post.schoolyearId, post.name),
    ]);

    if (error) throw error;
  }

  async assertCanUpdate(id: string, patch: LevelPatch): Promise<void | never> {
    const base = await this.services.level.getById(id);

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
    const schoolyear = await this.services.schoolyear.getById(schoolyearId);

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
          neq: schoolyearId,
        },
        id: {
          neq: id,
        },
      },
    });

    if (level.nodes.length) {
      throw new InputValidationError(LEVEL_NAME_EXISTS);
    }
  }
}
