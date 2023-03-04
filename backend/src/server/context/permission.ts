import { UserContextCreatorContext } from '.';
import { GraphQLNoPermissionError } from '../../resolvers/errors';

export interface BackendPermissionsContext {
  /**
   * Throws a GraphQLNoPermissionError if the user does not have the given permission.
   */
  assertPermission: (permission: string) => Promise<void>;

  hasPermission: (permission: string) => Promise<boolean>;
}

export function createPermissionsContext(
  context: UserContextCreatorContext
): BackendPermissionsContext {
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
