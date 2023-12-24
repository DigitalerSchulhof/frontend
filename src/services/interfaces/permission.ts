export interface PermissionService {
  /**
   * Whether the currently logged in user may message the given person.
   */
  mayMessagePerson(personId: string): Promise<boolean>;

  /**
   * Whether the currently logged in user has the given permission.
   */
  hasPermission(permission: string): Promise<boolean>;
}
