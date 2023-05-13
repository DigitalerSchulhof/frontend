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

    await sendPasswordResetEmail(context, account);

    return {
      formOfAddress: account.formOfAddress,
      email: account.email,
    };
  }
);

async function sendPasswordResetEmail(
  _context: BackendContext,
  account: WithId<AccountBase>
): Promise<void> {
  console.log(`Sent email to ${account.email}`);
  // TODO: Send email
}
