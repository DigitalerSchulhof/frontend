import { AccountResolvers } from '../../../types';

export const Account = {
  username: (p) => p.username,
} satisfies AccountResolvers;
