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
import crypto from 'crypto';
import ms from 'ms';
import { Service } from '../base';

export class AccountService extends Service<
  'accounts',
  AccountBase,
  AccountRepository
> {
  async createForPerson(
    personId: string,
    personRev: string,
    postWithoutPassword: Omit<AccountBase, 'password' | 'salt'>
  ): Promise<WithId<AccountBase>> {
    const password = generatePassword();
    const salt = generateSalt();

    const post = {
      ...postWithoutPassword,
      password: hashPassword(password, salt),
      salt,
    };

    await this.validator.assertCanCreate(post);

    const res = await this.repository.createForPerson(
      personId,
      post,
      personRev
    );

    await this.cache.set(res.id, res);

    return {
      ...res,
      password,
      salt,
    };
  }

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
    const res = await this.repository.searchOne({
      filter: new AndFilter(
        new AccountUsernameFilter(new EqFilterOperator(username)),
        new AccountEmailFilter(new EqFilterOperator(email))
      ),
    });

    if (!res) {
      return null;
    }

    await this.cache.set(res.id, res);

    return res;
  }

  async getByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<WithId<AccountBase> | null> {
    const res = await this.repository.searchOne({
      filter: new AccountUsernameFilter(new EqFilterOperator(username)),
    });

    if (!res) {
      return null;
    }

    if (!doPasswordsMatch(res.password, hashPassword(password, res.salt))) {
      return null;
    }

    await this.cache.set(res.id, res);

    return res;
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

    await this.changePassword(accountId, newPassword, Date.now() + ms('1h'));

    return newPassword;
  }

  async changePassword(
    accountId: string,
    newPassword: string,
    expiresAt: number | null,
    ifRev?: string
  ): Promise<WithId<AccountBase>> {
    const salt = generateSalt();

    const res = await this.update(
      accountId,
      {
        password: hashPassword(newPassword, salt),
        salt,
        passwordExpiresAt: expiresAt,
      },
      {
        skipValidation: true,
        ifRev,
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
