import { withPermission } from '../../../resolvers';
import { AccountResolvers } from '../../../types';

export const Account = {
  username: withPermission(
    'schulhof.administration.persons.accounts.username.read',
    (p) => p.username
  ),
} satisfies AccountResolvers;
