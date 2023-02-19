import { RootQueryResolvers } from '../../../types';
import { paginationToQuery, paginateResult, unique } from '../../../utils';
import { Schoolyear } from './models';

export const RootQuery = {
  schoolyears: async (_, args, ctx) => {
    const paginationQuery = paginationToQuery(args);

    const res = ctx.query<Schoolyear>`
      FOR s IN schoolyears
        ${paginationQuery}

        RETURN s
    `;

    return paginateResult(res, args);
  },
  schoolyear: async (_, args, ctx) => {
    const res = await ctx.query<Schoolyear>`
      FOR s IN schoolyears
        FILTER s._key == ${args.id}

        RETURN s
    `;
    return (await res.next()) ?? null;
  },
} satisfies RootQueryResolvers;
