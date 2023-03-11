import { CourseResolvers } from '../../types';

export const Course = {
  class: (p, _, ctx) => ctx.services.class.getById(p.classId),
} satisfies CourseResolvers;
