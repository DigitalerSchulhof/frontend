import { WithId } from '#/backend/repositories/arango';
import {
  AccountBase,
  AccountRepository,
} from '#/backend/repositories/content/account';
import { AccountFilter } from '#/backend/repositories/content/account/filters';
import { SessionAccountIdFilter } from '#/backend/repositories/content/session/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/backend/repositories/filters/operators';
import { Service } from '../base';

export class AccountService extends Service<
  'accounts',
  AccountBase,
  AccountRepository
> {
  override async delete(
    id: string,
    ifRev?: string | undefined
  ): Promise<WithId<AccountBase>> {
    const res = await super.delete(id, ifRev);

    await this.services.session.filterDelete(
      new SessionAccountIdFilter(new EqFilterOperator(id))
    );

    return res;
  }

  override async filterDelete(
    filter: AccountFilter
  ): Promise<WithId<AccountBase>[]> {
    const res = await super.filterDelete(filter);

    const accountIds = res.map((r) => r.id);

    await this.services.session.filterDelete(
      new SessionAccountIdFilter(new InFilterOperator(accountIds))
    );

    return res;
  }

  async updateLastLogin(
    accountId: string,
    lastLogin = new Date()
  ): Promise<void> {
    const res = await this.repository.updateLastLogin(
      accountId,
      lastLogin.getTime()
    );

    await this.cache.set(res.id, res);
  }
}
