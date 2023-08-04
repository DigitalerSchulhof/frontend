import type { Account, AccountService } from '#/services/interfaces/account';
import {
  AndFilter,
  OrFilter,
  type ListResult,
  type SearchOptions,
  type TypeFilter,
  type WithId,
} from '#/services/interfaces/base';
import type { AccountServiceClient } from '@dsh/protocols/dsh/services/account/v1/service';
import {
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
  accountFromJs,
  accountToJs,
} from '../converters/dsh/services/account/v1/resources';
import { GrpcService } from './base';

export class GrpcAccountService
  extends GrpcService<AccountServiceClient>
  implements AccountService
{
  async search(
    options: SearchOptions<WithId<Account>>
  ): Promise<ListResult<WithId<Account>>> {
    const res = await this.client.ListAccounts(
      new ListAccountsRequest({
        limit: options.limit,
        offset: options.offset,
        filter: filterToGrpc(options.filter),
        order_by: options.order,
      })
    );

    return {
      total: res.meta.total_count,
      items: res.accounts.map(accountToJs),
    };
  }

  async get(id: string): Promise<WithId<Account> | null> {
    const res = await this.client.GetAccount(new GetAccountRequest({ id }));

    return accountToJs(res.account);
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Account> | null)[]> {
    const res = await this.client.BatchGetAccounts(
      new BatchGetAccountsRequest({ ids })
    );

    return res.accounts.map(accountToJs);
  }

  async create(data: Account): Promise<WithId<Account>> {
    const res = await this.client.CreateAccount(
      new CreateAccountRequest({
        data: accountFromJs(data),
      })
    );

    return accountToJs(res.account);
  }

  async update(
    id: string,
    data: Partial<Account>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Account>> {
    const res = await this.client.UpdateAccount(
      new UpdateAccountRequest({
        id,
        data: accountFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
        if_rev: options?.ifRev,
      })
    );

    return accountToJs(res.account);
  }

  async updateWhere(
    filter: TypeFilter<Account>,
    data: Partial<Account>
  ): Promise<WithId<Account>[]> {
    const res = await this.client.UpdateAccountsWhere(
      new UpdateAccountsWhereRequest({
        filter: filterToGrpc(filter),
        data: accountFromJs(data),
        update_mask: new FieldMask({ paths: Object.keys(data) }),
      })
    );

    return res.accounts.map(accountToJs);
  }

  async delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Account>> {
    const res = await this.client.DeleteAccount(
      new DeleteAccountRequest({ id, if_rev: options?.ifRev })
    );

    return accountToJs(res.account);
  }

  async deleteWhere(filter: TypeFilter<Account>): Promise<WithId<Account>[]> {
    const res = await this.client.DeleteAccountsWhere(
      new DeleteAccountsWhereRequest({
        filter: filterToGrpc(filter),
      })
    );

    return res.accounts.map(accountToJs);
  }
}

export function filterToGrpc(
  filter: TypeFilter<Account> | undefined
): string | undefined {
  // JSON.stringify(undefined) === undefined
  return JSON.stringify(filterToGrpcWorker(filter));
}

function filterToGrpcWorker(
  filter: TypeFilter<Account> | undefined
): object | undefined {
  if (!filter) return undefined;

  if (filter instanceof AndFilter) {
    return {
      and: filter.filters.map(filterToGrpcWorker),
    };
  }

  if (filter instanceof OrFilter) {
    return {
      or: filter.filters.map(filterToGrpcWorker),
    };
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
      return { property: 'id', operator, value };
    case 'rev':
      return { property: 'rev', operator, value };
    case 'updatedAt':
      return {
        property: 'updated_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'createdAt':
      return {
        property: 'created_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'personId':
      return { property: 'person_id', operator, value };
    case 'username':
      return { property: 'username', operator, value };
    case 'email':
      return { property: 'email', operator, value };
    case 'password':
      return {
        property: 'password',
        operator,
        value: (value as Buffer).toString('base64'),
      };
    case 'salt':
      return {
        property: 'salt',
        operator,
        value: (value as Buffer).toString('base64'),
      };
    case 'passwordExpiresAt':
      return {
        property: 'password_expires_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'lastLogin':
      return {
        property: 'last_login',
        operator,
        value: (value as Date).getTime(),
      };
    case 'secondLastLogin':
      return {
        property: 'second_last_login',
        operator,
        value: (value as Date).getTime(),
      };
    case 'settings.emailOn.newMessage':
      return { property: 'settings.email_on.new_message', operator, value };
    case 'settings.emailOn.newSubstitution':
      return {
        property: 'settings.email_on.new_substitution',
        operator,
        value,
      };
    case 'settings.emailOn.newNews':
      return { property: 'settings.email_on.new_news', operator, value };
    case 'settings.pushOn.newMessage':
      return { property: 'settings.push_on.new_message', operator, value };
    case 'settings.pushOn.newSubstitution':
      return { property: 'settings.push_on.new_substitution', operator, value };
    case 'settings.pushOn.newNews':
      return { property: 'settings.push_on.new_news', operator, value };
    case 'settings.considerNews.newEvent':
      return { property: 'settings.consider_news.new_event', operator, value };
    case 'settings.considerNews.newBlog':
      return { property: 'settings.consider_news.new_blog', operator, value };
    case 'settings.considerNews.newGallery':
      return {
        property: 'settings.consider_news.new_gallery',
        operator,
        value,
      };
    case 'settings.considerNews.fileChanged':
      return {
        property: 'settings.consider_news.file_changed',
        operator,
        value,
      };
    case 'settings.mailbox.deleteAfter':
      return { property: 'settings.mailbox.delete_after', operator, value };
    case 'settings.mailbox.deleteAfterInBin':
      return {
        property: 'settings.mailbox.delete_after_in_bin',
        operator,
        value,
      };
    case 'settings.profile.sessionTimeout':
      return { property: 'settings.profile.session_timeout', operator, value };
    case 'settings.profile.formOfAddress':
      return {
        property: 'settings.profile.form_of_address',
        operator,
        value,
      };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}
