import { ClassResolvers } from '../../types';
import { paginate } from '../../utils';

export const Class = {
  level: (p, _, ctx) => ctx.services.level.getById(p.levelId),
  courses: (p, _, ctx) =>
    paginate(
      ctx.services.course.search({
        filters: {
          class: {
            id: {
              eq: p.id,
            },
          },
        },
      })
    ),
} satisfies ClassResolvers;
