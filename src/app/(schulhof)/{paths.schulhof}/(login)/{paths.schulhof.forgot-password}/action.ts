'use server';

import { requireNoLogin } from '#/auth/action';
import { WithId } from '#/backend/repositories/arango';
import {
  AccountBase,
  FormOfAddress,
} from '#/backend/repositories/content/account';
import { BackendContext } from '#/context';
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
  account: WithId<AccountBase>,
  newPassword: string
): Promise<void> {
  console.log(
    `Sent email to ${account.email} with new password ${newPassword}`
  );
  // TODO: Send email
}
