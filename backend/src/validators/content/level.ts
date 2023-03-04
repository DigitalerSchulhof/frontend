import { LevelBase, LevelPatch } from '@repositories/level';
import { LevelService } from '@services/level';
import { IdNotFoundError } from '../../repositories/utils';
import { MissingDependencyError } from '../../utils';
import { aggregateValidationErrors } from '../utils';

export const SCHOOLYEAR_DOES_NOT_EXIST = 'SCHOOLYEAR_DOES_NOT_EXIST';
export const LEVEL_NAME_EXISTS = 'LEVEL_NAME_EXISTS';

export interface LevelValidator {
  setService(service: LevelService): void;
  assertCanCreate(post: LevelBase): Promise<void | never>;
  assertCanUpdate(id: string, patch: LevelPatch): Promise<void | never>;
}

export class LevelValidatorImpl implements LevelValidator {
  private service: LevelService | null = null;

  setService(service: LevelService): void {
    this.service = service;
  }

  getService(): LevelService {
    if (!this.service) {
      throw new MissingDependencyError('LevelService');
    }

    return this.service;
  }

  async assertCanCreate(post: LevelBase): Promise<void | never> {
    await this.assertSchoolyearExists(post.schoolyearId);

    const error = await aggregateValidationErrors([
      this.assertExistsNoneInSchoolyearWithName(post.schoolyearId, post.name),
    ]);

    if (error) throw error;
  }

  async assertCanUpdate(id: string, patch: LevelPatch): Promise<void | never> {
    const base = await this.getService().getById(id);

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
    // TODO: Query schoolyear service for schoolyear with id and throw error if not found
    // throw new InputValidationError(SCHOOLYEAR_DOES_NOT_EXIST);
  }

  private async assertExistsNoneInSchoolyearWithName(
    schoolyearId: string,
    name: string
  ): Promise<void | never> {
    return this.assertExistsNoneInSchoolyearWithNameExceptId(
      schoolyearId,
      name,
      null
    );
  }

  private async assertExistsNoneInSchoolyearWithNameExceptId(
    schoolyearId: string,
    name: string,
    id: string | null
  ): Promise<void | never> {
    // TODO: Search service for level with name and different id and throw error if found
    // throw new InputValidationError(LEVEL_NAME_EXISTS);
  }
}
