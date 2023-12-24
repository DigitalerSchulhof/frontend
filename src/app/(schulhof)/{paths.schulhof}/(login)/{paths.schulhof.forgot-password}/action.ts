'use server';

import { requireNoLogin } from '#/auth/action';
import { FormOfAddress } from '#/services/interfaces/person';
import { wrapFormAction } from '#/utils/action';
import type { ClientFormOfAddress } from '#/utils/client';
import { v } from 'vality';

export default wrapFormAction(
  { username: v.string, email: v.string },
  async ({
    username,
    email,
  }): Promise<{
    formOfAddress: ClientFormOfAddress;
    email: string;
  }> => {
    const context = await requireNoLogin();

    const res = await context.services.user.resetPassword(username, email);

    return {
      formOfAddress: (
        {
          [FormOfAddress.Informal]: 'informal',
          [FormOfAddress.Formal]: 'formal',
        } as const
      )[res.formOfAddress],
      email: res.email,
    };
  }
);
