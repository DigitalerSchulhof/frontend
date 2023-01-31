import { GraphQLError, Kind, print } from 'graphql';
import {
  DateScalarConfig,
  RootMutationResolvers,
  RootQueryResolvers,
} from './types';

export const RootQuery = {
  _: () => null,
} satisfies RootQueryResolvers;

export const RootMutation = {
  _: () => null,
} satisfies RootMutationResolvers;
