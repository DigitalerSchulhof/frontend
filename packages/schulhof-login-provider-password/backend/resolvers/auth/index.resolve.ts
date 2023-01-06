import { login } from '.';
import { createJwt } from '@dsh/auth/backend/resolvers';
import { AuthErrorCode, RootMutationResolvers } from '../types';

export const RootMutation = {
  login: async (_, args, ctx) => {
    const { username, password } = args;
    const user = await login(ctx, { username, password });

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
