'use server';

import { requireLogin } from '#/auth/action';
import { wrapAction } from '#/utils/action';
import { v } from 'vality';

export default wrapAction(
  [v.string, v.string],
  async (personId, personRev): Promise<void> => {
    const context = await requireLogin({
      permission: 'schulhof.administration.person.delete-person',
      context: {
        personId,
      },
    });

    await context.services.person.deletePerson(personId, personRev);
  }
);
