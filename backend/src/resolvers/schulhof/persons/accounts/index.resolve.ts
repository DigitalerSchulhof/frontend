import { AccountResolvers } from '../../../types';
import { withPermission } from '../../../utils';

export const Account = {
  username: withPermission(
    'schulhof.administration.persons.accounts.username.read',
    (p) => p.username
  ),
} satisfies AccountResolvers;
