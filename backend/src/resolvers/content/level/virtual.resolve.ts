import { LevelResolvers } from '../../types';
import { paginate } from '../../utils';

export const Level = {
  schoolyear: (p, _, ctx) => ctx.services.schoolyear.getById(p.schoolyearId),
  classes: (p, _, ctx) =>
    paginate(
      ctx.services.class.search({
        filters: {
          level: {
            id: {
              eq: p.id,
            },
          },
        },
      })
    ),
} satisfies LevelResolvers;
