import { AccountResolvers, PersonResolvers } from '../../../types';
import { Person as TPerson } from '../persons/models';
import { Account as TAccount } from './models';

export const Person = {
  account: async (p, _, ctx) => {
    const res = await ctx.query<TAccount>`
      FOR v IN persons_accounts
        FILTER v._from == ${p._id}
        RETURN DOCUMENT(v._to)
    `;

    return (await res.next()) ?? null;
  },
} satisfies PersonResolvers;

export const Account = {
  person: async (p, _, ctx) => {
    const res = await ctx.query<TPerson>`
      FOR v IN persons_accounts
        FILTER v._to == ${p._id}
        RETURN DOCUMENT(v._from)
    `;

    return (await res.next())!;
  },
} satisfies AccountResolvers;
