import { createJwt } from '.';
import { LoginPasswordErrorCode, RootMutationResolvers } from '../../types';

export const RootMutation = {
  loginPassword: async (_, args, ctx) => {
    const { username, password } = args;

    const user = await ctx.query<Pick<User, '_key'>>`
      FOR user IN users
        FILTER user.username == ${username}
        FILTER SHA512(CONCAT(${password}, user.salt)) == user.password
        LIMIT 1
        RETURN KEEP(user, '_key')
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
