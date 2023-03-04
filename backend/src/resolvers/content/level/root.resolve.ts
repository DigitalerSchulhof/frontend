import { withoutNull } from '../../../utils';
import { RootMutationResolvers, RootQueryResolvers } from '../../types';
import { getPageInfo, unwrapInput } from '../../utils';

export const RootQuery = {
  level: async (_, args, ctx) => {
    const { id } = args;

    return ctx.services.level.getById(id);
  },
  levelsByIds: async (_, args, ctx) => {
    const { ids } = args;

    return ctx.services.level.getByIds(ids);
  },
  levels: async (_, __, ctx) => {
    const levels = await ctx.services.level.getAll();

    return {
      edges: levels.nodes.map((level) => ({
        node: level,
      })),
      pageInfo: getPageInfo(levels),
    };
  },
} satisfies RootQueryResolvers;

export const RootMutation = {
  createLevel: async (_, args, ctx) => {
    const post = unwrapInput(args.post);

    return ctx.services.level.create(post);
  },
  updateLevel: async (_, args, ctx) => {
    const { id } = args;
    const patch = unwrapInput(args.patch);
    const ifRev = withoutNull(args.ifRev);

    return ctx.services.level.update(id, patch, ifRev);
  },
  deleteLevel: async (_, args, ctx) => {
    const { id } = args;
    const ifRev = withoutNull(args.ifRev);

    return ctx.services.level.delete(id, ifRev);
  },
} satisfies RootMutationResolvers;
