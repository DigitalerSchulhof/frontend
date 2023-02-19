import { RootQueryResolvers } from '../../../types';

export const RootQuery = {
  schools: async (_, args, ctx) =>
    ctx.db.schulhof.school.searchWithPagination(args),
  school: (_, args, ctx) => ctx.db.schulhof.school.get(args.id),
} satisfies RootQueryResolvers;
