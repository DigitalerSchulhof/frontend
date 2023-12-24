'use server';

import { requireNoLogin } from '#/auth/action';
import { wrapFormAction } from '#/utils/action';
import { cookies } from 'next/headers';
import { v } from 'vality';

export default wrapFormAction(
  { username: v.string, password: v.string },
  async ({ username, password }): Promise<void> => {
    const context = await requireNoLogin();

    const res = await context.services.user.login(username, password);

    cookies().set('jwt', res.jwt);
  }
);
