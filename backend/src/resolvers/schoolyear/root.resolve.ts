import {
  DuplicateFieldsError,
  IdDoesNotExistError,
  RevMismatchError,
} from '@repositories/utils';
import { mapRepositoryFieldToGraphQLField } from '.';
import { withoutNull } from '../../utils';
import {
  GraphQLCannotCreateDuplicateFieldsError,
  GraphQLCannotDeleteIdNotFoundError,
  GraphQLCannotUpdateDuplicateFieldsError,
  GraphQLCannotUpdateIdNotFoundError,
  GraphQLCannotUpdateRevMismatchError,
} from '../errors';
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

    try {
      return await ctx.services.schoolyear.create(post);
    } catch (error) {
      if (error instanceof DuplicateFieldsError) {
        throw new GraphQLCannotCreateDuplicateFieldsError(
          error.conflictingFields.map(mapRepositoryFieldToGraphQLField)
        );
      }
      throw error;
    }
  },
  updateSchoolyear: async (_, args, ctx) => {
    const { id, patch } = args;
    const ifRev = withoutNull(args.ifRev);

    await ctx.assertPermission('schulhof.schoolyear.getById');
    await ctx.assertPermission('schulhof.schoolyear.update');

    try {
      return await ctx.services.schoolyear.update(id, patch, ifRev);
    } catch (error) {
      if (error instanceof RevMismatchError) {
        throw new GraphQLCannotUpdateRevMismatchError();
      }
      if (error instanceof IdDoesNotExistError) {
        throw new GraphQLCannotUpdateIdNotFoundError();
      }
      if (error instanceof DuplicateFieldsError) {
        throw new GraphQLCannotUpdateDuplicateFieldsError(
          error.conflictingFields.map(mapRepositoryFieldToGraphQLField)
        );
      }
      throw error;
    }
  },
  deleteSchoolyear: async (_, args, ctx) => {
    const { id } = args;
    const ifRev = withoutNull(args.ifRev);

    await ctx.assertPermission('schulhof.schoolyear.getById');
    await ctx.assertPermission('schulhof.schoolyear.delete');

    try {
      return await ctx.services.schoolyear.delete(id, ifRev);
    } catch (error) {
      if (error instanceof RevMismatchError) {
        throw new GraphQLCannotUpdateRevMismatchError();
      }
      if (error instanceof IdDoesNotExistError) {
        throw new GraphQLCannotDeleteIdNotFoundError();
      }
      throw error;
    }
  },
} satisfies RootMutationResolvers;
