'use server';

import { requireLogin } from '#/auth/action';
import { wrapFormAction } from '#/utils/action';
import { v } from 'vality';

export default wrapFormAction(
  {
    personId: v.string,
    personRev: v.string,
    oldPassword: v.string,
    newPassword: v.string,
    newPasswordAgain: v.string,
  },
  async ({
    personId,
    personRev,
    oldPassword,
    newPassword,
    newPasswordAgain,
  }): Promise<void> => {
    const context = await requireLogin({
      permission: 'schulhof.administration.persons.change-password',
      context: {
        personId,
      },
    });

    // TODO: Update
    // TODO: Remove old password check when not own
    await context.services.user.changePassword(
      personRev,
      oldPassword,
      newPassword,
      newPasswordAgain
    );
  }
);
