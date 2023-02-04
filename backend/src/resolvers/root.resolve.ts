import { hasPermissionResolver } from './resolvers';
import {
  FieldAccessResolvers,
  RootMutationResolvers,
  RootQueryResolvers
} from './types';

export const RootQuery = {
  _: () => null,
} satisfies RootQueryResolvers;

export const RootMutation = {
  _: () => null,
} satisfies RootMutationResolvers;

export const FieldAccess = {
  read: hasPermissionResolver((p) => p.read),
  write: hasPermissionResolver((p) => p.write),
} satisfies FieldAccessResolvers;
