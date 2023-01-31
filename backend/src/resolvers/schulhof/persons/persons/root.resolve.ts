import { RootQueryResolvers } from '../../../types';
import { paginationToQuery, paginateResult } from '../../../utils';
import { Person } from './models';

export const RootQuery = {
  persons: async (_, args, ctx) => {
    const paginationQuery = paginationToQuery(args);

    const res = ctx.query<Person>`
      FOR p IN persons
        ${paginationQuery}

        RETURN p
    `;

    return paginateResult(res, args);
  },
  person: async (_, args, ctx) => {
    const res = await ctx.query<Person>`
      FOR p IN persons
        FILTER p._key == ${args.id}

        RETURN p
    `;
    return (await res.next()) ?? null;
  },
} satisfies RootQueryResolvers;
