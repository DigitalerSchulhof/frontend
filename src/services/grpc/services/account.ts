import { Account, AccountService } from '#/services/interfaces/account';
import {
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from '#/services/interfaces/base';
import {
  AccountServiceClient,
  BatchGetAccountsRequest,
  CreateAccountRequest,
  DeleteAccountRequest,
  DeleteAccountsWhereRequest,
  GetAccountRequest,
  ListAccountsRequest,
  UpdateAccountRequest,
  UpdateAccountsWhereRequest,
} from '@dsh/protocols/dsh/services/account/v1/service';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';
import {
  accountFromObject,
  accountToObject,
} from '../converters/dsh/services/account/v1/resources';
import { GrpcService, filtersToGrpc } from './base';

export class AccountServiceGrpcService
  extends GrpcService<AccountServiceClient>
  implements AccountService
{
  async search(
    options: SearchOptions<Account>
  ): Promise<ListResult<WithId<Account>>> {
    const res = await this.client.ListAccounts(
      new ListAccountsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filtersToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.accounts.map(accountToObject),
    };
  }

  async get(id: string): Promise<WithId<Account> | null> {
    const res = await this.client.GetAccount(new GetAccountRequest({ id }));

    return accountToObject(res.account);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Account> | null)[]> {
    const res = await this.client.BatchGetAccounts(
      new BatchGetAccountsRequest({ ids })
    );

    return res.accounts.map(accountToObject);
  }

  async create(data: Account): Promise<WithId<Account>> {
    const res = await this.client.CreateAccount(
      new CreateAccountRequest({
        account: accountFromObject(data),
      })
    );

    return accountToObject(res.account);
  }

  async update(id: string, data: Partial<Account>): Promise<WithId<Account>> {
    const res = await this.client.UpdateAccount(
      new UpdateAccountRequest({
        id,
        account: accountFromObject(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return accountToObject(res.account);
  }

  async updateWhere(
    filter: TypeFilter<Account>,
    data: Partial<Account>
  ): Promise<WithId<Account>[]> {
    const res = await this.client.UpdateAccountsWhere(
      new UpdateAccountsWhereRequest({
        filter: filtersToGrpc(filter),
        data: accountFromObject(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.accounts.map(accountToObject);
  }

  async delete(id: string): Promise<WithId<Account>> {
    const res = await this.client.DeleteAccount(
      new DeleteAccountRequest({ id })
    );

    return accountToObject(res.account);
  }

  async deleteWhere(filter: TypeFilter<Account>): Promise<WithId<Account>[]> {
    const res = await this.client.DeleteAccountsWhere(
      new DeleteAccountsWhereRequest({
        filter: filtersToGrpc(filter),
      })
    );

    return res.accounts.map(accountToObject);
  }
}
