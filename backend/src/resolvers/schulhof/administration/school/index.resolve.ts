import { SchoolResolvers } from '../../../types';

export const School = {
  id: (p) => p._key,

  name: (p) => p.name,
} satisfies SchoolResolvers;
