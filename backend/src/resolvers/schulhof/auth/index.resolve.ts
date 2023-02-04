import { createJwt } from '.';
import { LoginPasswordErrorCode, RootMutationResolvers } from '../../types';
import { Account } from '../persons/accounts/models';

export const RootMutation = {
  loginPassword: async (_, args, ctx) => {
    const { username, password } = args;

    const user = await ctx.query<Pick<Account, '_key'>>`
      FOR a IN accounts
        FILTER a.username == ${username}
        FILTER SHA512(CONCAT(${password}, a.salt)) == a.password
        LIMIT 1
        RETURN KEEP(a, '_key')
    `.then((c) => c.next());

    if (!user) {
      return {
        __typename: 'LoginPasswordResponseError',
        code: LoginPasswordErrorCode.InvalidCredentials,
      };
    }

    return {
      __typename: 'LoginPasswordResponseSuccess',
      jwt: await createJwt(ctx, user),
    };
  },
} satisfies RootMutationResolvers;
