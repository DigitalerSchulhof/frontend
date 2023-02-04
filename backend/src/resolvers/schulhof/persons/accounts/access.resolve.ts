import {
  AccountAccessResolvers,
  AccountFieldsAccessResolvers,
  AccountResolvers,
} from '../../../types';
import { identity } from '../../../utils';

export const Account = {
  access: identity,
} satisfies AccountResolvers;

export const AccountAccess = {
  fields: identity,
} satisfies AccountAccessResolvers;

export const AccountFieldsAccess = {
  username: () => ({
    read: 'schulhof.administration.account.read.username',
    write: 'schulhof.administration.account.write.username',
  }),
} satisfies AccountFieldsAccessResolvers;
