import {
  Account,
  AccountService,
  CreateAccount,
} from '#/services/interfaces/account';
import { ListOptions, ListResult } from '#/services/interfaces/base';
import {
  AccountServiceClient,
  BatchGetAccountsRequest,
  CreateAccountRequest,
  DeleteAccountRequest,
  GetAccountRequest,
  ListAccountsRequest,
} from '@dsh/protocols/dsh/services/account/v1/service';
import {
  GrpcAdapter,
  createListRequest,
  transformListResponse,
} from '../../../../base';
import { accountFromObject, accountToObject } from './resources';

export class AccountServiceGrpcAdapter
  extends GrpcAdapter<AccountServiceClient>
  implements AccountService
{
  async list(options: ListOptions): Promise<ListResult<Account>> {
    const res = await this.client.ListAccounts(
      createListRequest(ListAccountsRequest, options)
    );

    return transformListResponse('accounts', accountToObject, res);
  }

  async get(id: string): Promise<Account | null> {
    const res = await this.client.GetAccount(new GetAccountRequest({ id }));

    return accountToObject(res.account);
  }

  async getByIds(ids: readonly string[]): Promise<Account[]> {
    const res = await this.client.BatchGetAccounts(
      new BatchGetAccountsRequest({ ids })
    );

    return res.accounts.map(accountToObject);
  }

  async create(data: CreateAccount, personId: string): Promise<Account> {
    const res = await this.client.CreateAccount(
      new CreateAccountRequest({
        person_id: personId,
        account: accountFromObject(data),
      })
    );

    return accountToObject(res.account);
  }

  update(id: string, data: Partial<CreateAccount>): Promise<Account> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<Account> {
    const res = await this.client.DeleteAccount(
      new DeleteAccountRequest({ id })
    );

    return accountToObject(res.account);
  }
}
