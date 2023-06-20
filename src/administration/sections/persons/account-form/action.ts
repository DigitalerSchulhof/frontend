'use server';

import { requireLogin } from '#/auth/action';
import { LoggedInBackendContext } from '#/context';
import { InvalidInputError, wrapFormAction } from '#/utils/action';
import ms from 'ms';
import { Parse, v } from 'vality';

const accountSchema = {
  username: v.string,
  email: v.string,
};

export type AccountInput = Parse<typeof accountSchema>;

export default wrapFormAction(
  {
    personId: v.string,
    personRev: v.string,
    accountRev: v.string,
    username: v.string,
    email: v.string,
  },
  async ({ personId, personRev, accountRev, username, email }) => {
    const context = await requireLogin();

    const data = { username, email };

    if (!accountRev) {
      return createAccount(context, personId, personRev, data);
    } else {
      return editAccount(context, personId, accountRev, data);
    }
  }
);

async function createAccount(
  context: LoggedInBackendContext,
  personId: string,
  personRev: string,
  data: AccountInput
) {
  const person = await context.services.person.get(personId);

  if (!person) {
    throw new InvalidInputError();
  }

  await context.services.account.createForPerson(personId, personRev, {
    ...data,
    personId,
    passwordExpiresAt: Date.now() + ms('1h'),
    lastLogin: null,
    secondLastLogin: null,
    settings: {
      emailOn: {
        newMessage: true,
        newSubstitution: true,
        newNews: true,
      },
      pushOn: {
        newMessage: true,
        newSubstitution: true,
        newNews: true,
      },
      considerNews: {
        newEvent: true,
        newBlog: true,
        newGallery: true,
        fileChanged: true,
      },
      mailbox: {
        deleteAfter: 30,
        deleteAfterInBin: 90,
      },
      profile: {
        sessionTimeout: 60,
        formOfAddress: person.type === 'student' ? 'informal' : 'formal',
      },
    },
  });

  // TODO: Send mail to user
}

async function editAccount(
  context: LoggedInBackendContext,
  personId: string,
  accountRev: string,
  data: AccountInput
) {
  const person = await context.services.person.getById(personId);

  if (!person || person.accountId === null) {
    throw new InvalidInputError();
  }

  await context.services.account.update(person.accountId, data, {
    ifRev: accountRev,
  });
}
