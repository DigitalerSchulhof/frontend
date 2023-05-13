'use server';

import { requireLogin } from '#/auth/action';
import { wrapAction } from '#/utils/action';

export const editAccount = wrapAction(
  async (personId: string, username: string, email: string) => {
    const context = await requireLogin();

    await context.services.account.update(context.account.id, {
      personId,
      username,
      email,
    });
  }
);
