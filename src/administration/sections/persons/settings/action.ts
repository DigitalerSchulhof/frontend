'use server';

import { requireLogin } from '#/auth/action';
import { FORMS_OF_ADDRESS } from '#/services/interfaces/account';
import { wrapFormAction } from '#/utils/action';
import { v } from 'vality';

export default wrapFormAction(
  {
    id: v.string,
    rev: v.string,
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
    profileFormOfAddress: FORMS_OF_ADDRESS,
  },
  async ({
    id,
    rev,
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
  }) => {
    const context = await requireLogin();

    await context.services.account.update(
      id,
      {
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
            formOfAddress: profileFormOfAddress,
          },
        },
      },
      {
        ifRev: rev,
      }
    );
  }
);
