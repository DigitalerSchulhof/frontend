import { withoutNull } from '../../utils';
import { RootMutationResolvers, RootQueryResolvers } from '../types';
import { getPageInfo } from '../utils';

export const RootQuery = {
  schoolyear: async (_, args, ctx) => {
    const { id } = args;

    await ctx.assertPermission('schulhof.schoolyear.getById');

    return ctx.services.schoolyear.getById(id);
  },
  schoolyearsByIds: async (_, args, ctx) => {
    const { ids } = args;

    await ctx.assertPermission('schulhof.schoolyear.getById');

    return ctx.services.schoolyear.getByIds(ids);
  },
  schoolyears: async (_, __, ctx) => {
    await ctx.assertPermission('schulhof.schoolyear.getAll');

    const schoolyears = await ctx.services.schoolyear.getAll();

    return {
      edges: schoolyears.nodes.map((schoolyear) => ({
        node: schoolyear,
      })),
      pageInfo: getPageInfo(schoolyears),
    };
  },
} satisfies RootQueryResolvers;

export const RootMutation = {
  createSchoolyear: async (_, args, ctx) => {
    const { post } = args;

    await ctx.assertPermission('schulhof.schoolyear.getById');
    await ctx.assertPermission('schulhof.schoolyear.create');

    return ctx.services.schoolyear.create(post);
  },
  updateSchoolyear: async (_, args, ctx) => {
    const { id, patch } = args;
    const ifRev = withoutNull(args.ifRev);

    await ctx.assertPermission('schulhof.schoolyear.getById');
    await ctx.assertPermission('schulhof.schoolyear.update');

    return ctx.services.schoolyear.update(id, patch, ifRev);
  },
  deleteSchoolyear: async (_, args, ctx) => {
    const { id } = args;
    const ifRev = withoutNull(args.ifRev);

    await ctx.assertPermission('schulhof.schoolyear.getById');
    await ctx.assertPermission('schulhof.schoolyear.delete');

    return ctx.services.schoolyear.delete(id, ifRev);
  },
} satisfies RootMutationResolvers;
