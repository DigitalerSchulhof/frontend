import { SchoolyearResolvers } from '../../../types';

export const Schoolyear = {
  id: (p) => p._key,

  name: (p) => p.name,
} satisfies SchoolyearResolvers;
