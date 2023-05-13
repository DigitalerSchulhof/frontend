import { WithId } from '#/backend/repositories/arango';
import {
  AccountBase,
  AccountRepository,
} from '#/backend/repositories/content/account';
import {
  AccountEmailFilter,
  AccountFilter,
  AccountUsernameFilter,
} from '#/backend/repositories/content/account/filters';
import { SessionAccountIdFilter } from '#/backend/repositories/content/session/filters';
import { AndFilter } from '#/backend/repositories/filters';
import {
  EqFilterOperator,
  InFilterOperator,
} from '#/backend/repositories/filters/operators';
import { ErrorWithPayload } from '#/utils';
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

  async getByUsernameAndEmail(
    username: string,
    email: string
  ): Promise<WithId<AccountBase> | null> {
    const res = await this.repository.search({
      filter: new AndFilter(
        new AccountUsernameFilter(new EqFilterOperator(username)),
        new AccountEmailFilter(new EqFilterOperator(email))
      ),
    });

    if (!res.nodes.length) {
      return null;
    }

    if (res.nodes.length > 1) {
      throw new ErrorWithPayload(
        'Multiple accounts found with username and email',
        {
          username,
          email,
        }
      );
    }

    const account = res.nodes[0];

    await this.cache.set(account.id, account);

    return account;
  }

  async getByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<WithId<AccountBase> | null> {
    const res = await this.repository.getByUsernameAndPassword(
      username,
      password
    );

    if (!res.nodes.length) {
      return null;
    }

    if (res.nodes.length > 1) {
      throw new ErrorWithPayload(
        'Multiple accounts found with username and password',
        {
          username,
        }
      );
    }

    const account = res.nodes[0];

    await this.cache.set(account.id, account);

    return account;
  }
}
