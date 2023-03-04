import { deepWithoutNull, withoutNull } from '../../../utils';
import { RootMutationResolvers, RootQueryResolvers } from '../../types';
import { getPageInfo, unwrapInput } from '../../utils';

export const RootQuery = {
  schoolyear: async (_, args, ctx) => {
    const { id } = args;

    return ctx.services.schoolyear.getById(id);
  },
  schoolyearsByIds: async (_, args, ctx) => {
    const { ids } = args;

    return ctx.services.schoolyear.getByIds(ids);
  },
  schoolyears: async (_, args, ctx) => {
    const searchArgs = deepWithoutNull(args);

    const schoolyears = await ctx.services.schoolyear.search(searchArgs);

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
    const post = unwrapInput(args.post);

    return ctx.services.schoolyear.create(post);
  },
  updateSchoolyear: async (_, args, ctx) => {
    const { id } = args;
    const patch = unwrapInput(args.patch);
    const ifRev = withoutNull(args.ifRev);

    return ctx.services.schoolyear.update(id, patch, ifRev);
  },
  deleteSchoolyear: async (_, args, ctx) => {
    const { id } = args;
    const ifRev = withoutNull(args.ifRev);

    return ctx.services.schoolyear.delete(id, ifRev);
  },
} satisfies RootMutationResolvers;
