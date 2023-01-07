import { createJwt } from '@dsh/auth/backend/resolvers';
import { AuthErrorCode, RootMutationResolvers } from '../types';
import { User } from '../user/model';

export const RootMutation = {
  login: async (_, args, ctx) => {
    const { username, password } = args;

    const user = await ctx.query<Pick<User, '_key'>>`
      FOR user IN users
        FILTER user.username == ${username}
        FILTER SHA512(CONCAT(${password}, user.salt)) == user.password
        LIMIT 1
        RETURN {
          _key: user._key,
        }
    `.then((c) => c.next());

    if (!user) {
      return {
        __typename: 'AuthResponseError',
        code: AuthErrorCode.InvalidCredentials,
      };
    }

    return {
      __typename: 'AuthResponseSuccess',
      jwt: await createJwt(ctx, user),
    };
  },
} satisfies RootMutationResolvers;
