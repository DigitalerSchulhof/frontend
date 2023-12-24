export interface PermissionService {
  /**
   * Whether the currently logged in user may message the given person.
   */
  mayMessagePerson(personId: string): Promise<boolean>;
}
