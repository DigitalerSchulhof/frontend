'use server';

import { requireNoLogin } from '#/auth/action';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { BackendContext } from '#/context';
import { wrapAction } from '#/utils/action';
import { ClientError } from '#/utils/server';

export const forgotPassword = wrapAction(
  async (username: string, email: string) => {
    const context = await requireNoLogin();

    const account = await context.services.account.getByUsernameAndEmail(
      username,
      email
    );

    if (!account) {
      throw new ClientError('INVALID_CREDENTIALS');
    }

    const newPassword = await context.services.account.resetPassword(
      account.id
    );

    await sendPasswordResetEmail(context, account, newPassword);

    return {
      formOfAddress: account.formOfAddress,
      email: account.email,
    };
  }
);

async function sendPasswordResetEmail(
  _context: BackendContext,
  account: WithId<AccountBase>,
  newPassword: string
): Promise<void> {
  console.log(
    `Sent email to ${account.email} with new password ${newPassword}`
  );
  // TODO: Send email
}
