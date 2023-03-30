import { Repositories } from '#/backend/context/services';
import { MakePatch } from '#/backend/repositories/utils';

export abstract class Validator<Name, Base> {
  private readonly _collection: Name | undefined;

  constructor(protected readonly repositories: Repositories) {}

  abstract assertCanCreate(post: Base): Promise<void | never>;
  abstract assertCanUpdate(
    id: string,
    patch: MakePatch<Base>
  ): Promise<void | never>;

  protected async throwValidationError(error: string): Promise<never> {
    throw new Error(error);
  }
}
