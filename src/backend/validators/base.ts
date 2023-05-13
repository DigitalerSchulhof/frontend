import { MakePatch } from '#/backend/repositories/utils';
import { InputValidationError } from '#/backend/validators/utils';
import { Repositories } from '#/context/services';

export abstract class Validator<Name, Base> {
  private readonly _collection: Name | undefined;

  constructor(protected readonly repositories: Repositories) {}

  abstract assertCanCreate(post: Base): Promise<void | never>;
  abstract assertCanUpdate(
    id: string,
    patch: MakePatch<Base>
  ): Promise<void | never>;

  protected async throwValidationError(error: string): Promise<never> {
    throw new InputValidationError(error);
  }
}
