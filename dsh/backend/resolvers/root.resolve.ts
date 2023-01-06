import { RootQueryResolvers, RootMutationResolvers } from './types';

export const RootQuery = {
  _: () => null,
} satisfies RootQueryResolvers;

export const RootMutation = {
  _: () => null,
} satisfies RootMutationResolvers;
