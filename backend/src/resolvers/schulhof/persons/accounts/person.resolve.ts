import { AccountResolvers, PersonResolvers } from '../../../types';
import { Person as MPerson } from '../persons/models';
import { Account as MAccount } from './models';

export const Account = {
  person: async (p, _, ctx) => {
    const res = await ctx.query<MPerson>`
      FOR v IN persons_accounts
        FILTER v._to == ${p._id}
        RETURN DOCUMENT(v._from)
    `;

    // Accounts must have a connected person
    return (await res.next())!;
  },
} satisfies AccountResolvers;

export const Person = {
  account: async (p, _, ctx) => {
    const res = await ctx.query<MAccount>`
      FOR v IN persons_accounts
        FILTER v._from == ${p._id}
        RETURN DOCUMENT(v._to)
    `;

    // But not every person has an account
    return (await res.next()) ?? null;
  },
} satisfies PersonResolvers;
