import { UserContextCreatorContext } from '.';

export interface BackendPermissionsContext {
  hasPermission: (permission: string) => Promise<boolean>;
}

export function createPermissionsContext(
  context: UserContextCreatorContext
): BackendPermissionsContext {
  async function hasPermission(permission: string): Promise<boolean> {
    return true;
  }

  return {
    hasPermission,
  };
}
