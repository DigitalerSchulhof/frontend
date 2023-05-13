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
import crypto from 'crypto';
import { Service } from '../base';
import ms from 'ms';

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
    const res = await this.repository.search({
      filter: new AccountUsernameFilter(new EqFilterOperator(username)),
    });

    if (!res.nodes.length) {
      return null;
    }

    if (res.nodes.length > 1) {
      throw new ErrorWithPayload('Multiple accounts found with username', {
        username,
      });
    }

    const account = res.nodes[0];

    if (
      !doPasswordsMatch(account.password, hashPassword(password, account.salt))
    ) {
      return null;
    }

    await this.cache.set(account.id, account);

    return account;
  }

  async isPasswordValid(accountId: string, password: string): Promise<boolean> {
    const account = await this.getById(accountId);

    if (!account) {
      return false;
    }

    return doPasswordsMatch(
      account.password,
      hashPassword(password, account.salt)
    );
  }

  async resetPassword(accountId: string): Promise<string> {
    const newPassword = generatePassword();

    await this.changePassword(
      accountId,
      newPassword,
      new Date(Date.now() + ms('1h'))
    );

    return newPassword;
  }

  async changePassword(
    accountId: string,
    newPassword: string,
    expiresAt: Date | null
  ): Promise<WithId<AccountBase>> {
    const salt = generateSalt();

    const res = await this.update(
      accountId,
      {
        password: hashPassword(newPassword, salt),
        salt,
        passwordExpiresAt: expiresAt ? expiresAt.getTime() : null,
      },
      {
        skipValidation: true,
      }
    );

    return res;
  }
}

function generateSalt(): string {
  return crypto.randomBytes(128).toString('base64');
}

const wishlist =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';

function generatePassword(length = 20): string {
  // https://stackoverflow.com/a/51540480/12405307

  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');
}

function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('base64');
}

function doPasswordsMatch(
  hashedPassword: string,
  hashedOtherPassword: string
): boolean {
  return (
    hashedPassword.length === hashedOtherPassword.length &&
    crypto.timingSafeEqual(
      Buffer.from(hashedPassword, 'base64'),
      Buffer.from(hashedOtherPassword, 'base64')
    )
  );
}
