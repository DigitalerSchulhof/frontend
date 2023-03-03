import { SchoolyearResolvers } from '../../types';

export const Schoolyear = {
  id: (p) => p.id,
  rev: (p) => p.rev,
  name: (p) => p.name,
  start: (p) => p.start,
  end: (p) => p.end,
} satisfies SchoolyearResolvers;
