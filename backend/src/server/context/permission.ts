import { ContextCreatorUserContext } from '.';
import { GraphQLNoPermissionError } from '../../resolvers/utils';

export interface BackendPermissionsContext {
  /**
   * Throws a GraphQLError if the user does not have the given permission.
   */
  assertPermission: (permission: string) => Promise<void>;

  hasPermission: (permission: string) => Promise<boolean>;
}

export function createPermissionsContext(context: ContextCreatorUserContext) {
  async function hasPermission(permission: string): Promise<boolean> {
    return true;
  }

  return {
    assertPermission: async (permission: string) => {
      if (!(await hasPermission(permission))) {
        throw new GraphQLNoPermissionError(permission);
      }
    },
    hasPermission,
  };
}
