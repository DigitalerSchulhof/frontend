import { MakePatch } from '#/repositories/utils';
import { Repositories } from '../server/context/services';

export abstract class Validator<Name, Base> {
  private readonly _collection: Name | undefined;

  constructor(protected readonly repositories: Repositories) {}

  abstract assertCanCreate(post: Base): Promise<void | never>;
  abstract assertCanUpdate(
    id: string,
    patch: MakePatch<Base>
  ): Promise<void | never>;
}
