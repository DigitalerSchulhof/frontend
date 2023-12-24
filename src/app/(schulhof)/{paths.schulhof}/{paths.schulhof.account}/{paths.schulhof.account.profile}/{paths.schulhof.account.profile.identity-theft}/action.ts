'use server';

import { requireLogin } from '#/auth/action';
import { wrapFormAction } from '#/utils/action';
import { v } from 'vality';

export default wrapFormAction(
  {
    personRev: v.string,
    oldPassword: v.string,
    newPassword: v.string,
    newPasswordAgain: v.string,
  },
  async ({
    personRev,
    oldPassword,
    newPassword,
    newPasswordAgain,
  }): Promise<void> => {
    const context = await requireLogin();

    await context.services.user.reportIdentityTheft(
      personRev,
      oldPassword,
      newPassword,
      newPasswordAgain
    );
  }
);
