'use server';

import { requireLogin } from '#/auth/action';
import { wrapFormAction } from '#/utils/action';
import { v } from 'vality';

export default wrapFormAction(
  {
    personId: v.string,
    personRev: v.string,
    mode: ['create', 'edit'],
    username: v.string,
    email: v.string,
  },
  async ({ personId, personRev, mode, username, email }): Promise<void> => {
    const context = await requireLogin({
      permission: `schulhof.administration.persons.${mode}-account`,
      context: {
        personId: personId,
      },
    });

    const data = { username, email };

    if (mode === 'create') {
      await context.services.person.createAccount(personId, personRev, data);
    } else {
      await context.services.person.updateAccount(personId, personRev, data);
    }
  }
);
