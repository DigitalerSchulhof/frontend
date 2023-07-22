import type { BackendContext } from '#/context';
import type { Account } from '#/services/interfaces/account';
import type { WithId } from '#/services/interfaces/base';

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
