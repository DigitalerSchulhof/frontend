'use server';

import { requireLogin } from '#/auth/action';
import { FormOfAddress } from '#/services/interfaces/person';
import { wrapFormAction } from '#/utils/action';
import { v } from 'vality';

export default wrapFormAction(
  {
    personId: v.string,
    personRev: v.string,
    emailOnNewMessage: v.toggle,
    emailOnNewSubstitution: v.toggle,
    emailOnNewNews: v.toggle,
    pushOnNewMessage: v.toggle,
    pushOnNewSubstitution: v.toggle,
    pushOnNewNews: v.toggle,
    considerNewsNewEvent: v.toggle,
    considerNewsNewBlog: v.toggle,
    considerNewsNewGallery: v.toggle,
    considerNewsFileChanged: v.toggle,
    mailboxDeleteAfter: [v.number, null],
    mailboxDeleteAfterInBin: [v.number, null],
    profileSessionTimeout: v.number,
    profileFormOfAddress: ['informal', 'formal'],
  },
  async ({
    personId,
    personRev,
    emailOnNewMessage,
    emailOnNewSubstitution,
    emailOnNewNews,
    pushOnNewMessage,
    pushOnNewSubstitution,
    pushOnNewNews,
    considerNewsNewEvent,
    considerNewsNewBlog,
    considerNewsNewGallery,
    considerNewsFileChanged,
    mailboxDeleteAfter,
    mailboxDeleteAfterInBin,
    profileSessionTimeout,
    profileFormOfAddress,
  }): Promise<void> => {
    const context = await requireLogin();

    await context.services.person.updateAccount(personId, personRev, {
      settings: {
        emailOn: {
          newMessage: emailOnNewMessage,
          newSubstitution: emailOnNewSubstitution,
          newNews: emailOnNewNews,
        },
        pushOn: {
          newMessage: pushOnNewMessage,
          newSubstitution: pushOnNewSubstitution,
          newNews: pushOnNewNews,
        },
        considerNews: {
          newEvent: considerNewsNewEvent,
          newBlog: considerNewsNewBlog,
          newGallery: considerNewsNewGallery,
          fileChanged: considerNewsFileChanged,
        },
        mailbox: {
          deleteAfter: mailboxDeleteAfter,
          deleteAfterInBin: mailboxDeleteAfterInBin,
        },
        profile: {
          sessionTimeout: profileSessionTimeout,
          formOfAddress: {
            informal: FormOfAddress.Informal,
            formal: FormOfAddress.Formal,
          }[profileFormOfAddress],
        },
      },
    });
  }
);
