'use server';

import { requireNoLogin } from '#/auth/action';
import type { BackendContext } from '#/context';
import type { Account, FormOfAddress } from '#/services/interfaces/account';
import { AndFilter, Filter, type WithId } from '#/services/interfaces/base';
import { wrapFormAction } from '#/utils/action';
import { generatePassword } from '#/utils/password';
import { ClientError } from '#/utils/server';
import ms from 'ms';
import { v } from 'vality';

export default wrapFormAction(
  { username: v.string, email: v.string },
  async ({
    username,
    email,
  }): Promise<{
    formOfAddress: FormOfAddress;
    email: string;
  }> => {
    const context = await requireNoLogin();

    const {
      items: [account],
      total,
    } = await context.services.account.search({
      filter: new AndFilter(
        new Filter('username', 'eq', username),
        new Filter('email', 'eq', email)
      ),
      limit: 1,
    });

    if (!total) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    await resetPassword(context, account);

    return {
      formOfAddress: account.settings.profile.formOfAddress,
      email: account.email,
    };
  }
);

async function resetPassword(
  context: BackendContext,
  account: WithId<Account>
) {
  const {
    hashedPassword: hashedNewPassword,
    rawPassword: newPassword,
    salt: newSalt,
  } = await generatePassword();

  await context.services.account.update(account.id, {
    password: hashedNewPassword,
    salt: newSalt,
    passwordExpiresAt: new Date(Date.now() + ms('1h')),
  });

  await sendPasswordResetEmail(context, account, newPassword);
}

async function sendPasswordResetEmail(
  _context: BackendContext,
  account: WithId<Account>,
  newPassword: string
): Promise<void> {
  console.log(
    `Sent email to ${account.email} with new password ${newPassword}`
  );
  // TODO: Send email
}
