import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { BackendContext } from '#/context';

export interface BackendPermissionsContext {
  hasPermission: (permission: string) => Promise<boolean>;
}

export function createPermissionsContext(
  context: BackendContext,
  account: WithId<AccountBase>
): BackendPermissionsContext {
  async function hasPermission(permission: string): Promise<boolean> {
    return true;
  }

  return {
    hasPermission,
  };
}
