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
      permission: 'permissions.administration.persons.report-identity-theft',
      context: {
        personId,
      },
    });

    // TODO: Update call
    await context.services.user.reportIdentityTheft(
      personRev,
      oldPassword,
      newPassword,
      newPasswordAgain
    );
  }
);
