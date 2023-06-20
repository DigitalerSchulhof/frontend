import { BackendContext } from '#/context';

export interface BackendPermissionsContext {
  hasPermission: (permission: string) => Promise<boolean>;
}

export function createPermissionsContext(
  context: BackendContext,
  account: WithId<Account>
): BackendPermissionsContext {
  async function hasPermission(permission: string): Promise<boolean> {
    return true;
  }

  return {
    hasPermission,
  };
}
