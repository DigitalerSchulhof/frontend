export interface PermissionService {
  /**
   * Whether the currently logged in user has the given permission.
   */
  hasPermission(
    permission:
      | string
      | {
          /**
           * Condition that must be met for the permission to be checked in the first place
           */
          checkIf?: boolean;
          permission: string;
          context: object;
        }
  ): Promise<boolean>;
}
