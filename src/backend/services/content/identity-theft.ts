import {
  IdentityTheftBase,
  IdentityTheftRepository,
} from '#/backend/repositories/content/identity-theft';
import { Service } from '../base';

export class IdentityTheftService extends Service<
  'identity-thefts',
  IdentityTheftBase,
  IdentityTheftRepository
> {
  async report(personId: string): Promise<void> {
    const now = new Date();

    await this.create({
      personId,
      reportedAt: now.getTime(),
    });

    // TODO: What to do when this happens? Notification?
  }
}
