import { createJwt } from '.';
import { RootMutationResolvers } from '../../types';
import { TypedGraphQLError } from '../../utils';
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
      throw new TypedGraphQLError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    return {
      jwt: await createJwt(ctx, user),
    };
  },
} satisfies RootMutationResolvers;
