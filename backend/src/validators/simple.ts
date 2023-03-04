export interface SimpleValidator<Base, Patch> {
  assertCanCreate(post: Base): Promise<void | never>;
  assertCanUpdate(id: string, patch: Patch): Promise<void | never>;
}
