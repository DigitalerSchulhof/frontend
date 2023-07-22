'use server';

import { requireNoLogin } from '#/auth/action';
import type { BackendContext } from '#/context';
import type { Account, FormOfAddress } from '#/services/interfaces/account';
import type { WithId } from '#/services/interfaces/base';
import { wrapFormAction } from '#/utils/action';
import { ClientError } from '#/utils/server';
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
      formOfAddress: account.settings.profile.formOfAddress,
      email: account.email,
    };
  }
);

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
