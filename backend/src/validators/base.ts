import { Repositories } from '../server/context/services';

export class Validator {
  constructor(protected readonly repositories: Repositories) {}
}
