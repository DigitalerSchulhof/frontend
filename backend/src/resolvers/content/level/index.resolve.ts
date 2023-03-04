import { LevelResolvers } from '../../types';

export const Level = {
  id: (p) => p.id,
  rev: (p) => p.rev,

  schoolyear: async (p, _, ctx) =>
    (await ctx.services.schoolyear.getById(p.schoolyearId))!,
  name: (p) => p.name,
} satisfies LevelResolvers;
