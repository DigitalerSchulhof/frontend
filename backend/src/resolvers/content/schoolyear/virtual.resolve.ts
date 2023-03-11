import { SchoolyearResolvers } from '../../types';
import { paginate } from '../../utils';

export const Schoolyear = {
  levels: (p, _, ctx) =>
    paginate(
      ctx.services.level.search({
        filters: {
          schoolyear: {
            id: {
              eq: p.id,
            },
          },
        },
      })
    ),
} satisfies SchoolyearResolvers;
