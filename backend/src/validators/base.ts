import { Repositories, Services } from '../server/context/services';

export class Validator {
  constructor(
    protected readonly repositories: Repositories,
    protected readonly services: Services
  ) {}
}
