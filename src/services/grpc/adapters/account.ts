import { Account, AccountService } from '#/services/interfaces/account';
import { ListOptions, ListResult, WithId } from '#/services/interfaces/base';
import {
  AccountServiceClient,
  BatchGetAccountsRequest,
  CreateAccountRequest,
  DeleteAccountRequest,
  GetAccountRequest,
  ListAccountsRequest,
  UpdateAccountRequest,
} from '@dsh/protocols/dsh/services/account/v1/service';
import {
  accountFromObject,
  accountToObject,
} from '../converters/dsh/services/account/v1/resources';
import { GrpcAdapter, createListRequest, transformListResponse } from './base';
import { FieldMask } from '@dsh/protocols/google/protobuf/field_mask';

export class AccountServiceGrpcAdapter
  extends GrpcAdapter<AccountServiceClient>
  implements AccountService
{
  async list(options: ListOptions): Promise<ListResult<WithId<Account>>> {
    const res = await this.client.ListAccounts(
      createListRequest(ListAccountsRequest, options)
    );

    return transformListResponse('accounts', accountToObject, res);
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
        account: accountFromObject({ id, ...data }),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return accountToObject(res.account);
  }

  async delete(id: string): Promise<WithId<Account>> {
    const res = await this.client.DeleteAccount(
      new DeleteAccountRequest({ id })
    );

    return accountToObject(res.account);
  }
}
