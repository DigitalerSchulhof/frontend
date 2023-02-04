import { BackendContext } from '../context';
import { ResolverFn } from './types';

/**
 * Returns a resolver that checks if the user has the given permission.
 *
 * @example
 * ```ts
 * export const PersonFieldsAccess = {
 *   type: hasPermissionResolver('schulhof.administration.person.read.type'),
 * } satisfies PersonFieldsAccess;
 * ```
 *
 * @example
 * ```ts
 * export const PersonActionsAccess = {
 *   mail: hasPermissionResolver((p) => `schulhof.mail.send.${p.type}`),
 * } satisfies PersonActionsAccess;
 * ```
 */
export function hasPermissionResolver<TParent extends {}, TArgs extends {}>(
  permissionOrGetPermission:
    | string
    | boolean
    | ResolverFn<string | boolean, TParent, BackendContext, TArgs>
): ResolverFn<boolean, TParent, BackendContext, TArgs> {
  return async function hasPermissionResolverWorker(p, args, ctx, info) {
    const permission =
      typeof permissionOrGetPermission === 'string' ||
      typeof permissionOrGetPermission === 'boolean'
        ? permissionOrGetPermission
        : await permissionOrGetPermission(p, args, ctx, info);

    return (
      (typeof permission === 'boolean' && permission) ||
      ctx.hasPermission(permission)
    );
  };
}

/**
 * Executes the given resolver only if the user has the given permission. The resolver returns `null` otherwise.
 *
 * @example
 * ```ts
 * export const Person = {
 *   type: withPermission(
 *     'schulhof.administration.person.read.type',
 *     (p) => p.type
 *   ),
 * } satisfies Person;
 * ```
 */
export function withPermission<TReturn, TParent extends {}, TArgs extends {}>(
  permissionOrGetPermission:
    | string
    | boolean
    | ResolverFn<string | boolean, TParent, BackendContext, TArgs>,
  getValue: ResolverFn<TReturn, TParent, BackendContext, TArgs>
): ResolverFn<TReturn | null, TParent, BackendContext, TArgs> {
  return async function withPermissionWorker(p, args, ctx, info) {
    if (typeof permissionOrGetPermission === 'boolean') {
      return permissionOrGetPermission ? getValue(p, args, ctx, info) : null;
    }

    const permission =
      typeof permissionOrGetPermission === 'string' ||
      typeof permissionOrGetPermission === 'boolean'
        ? permissionOrGetPermission
        : await permissionOrGetPermission(p, args, ctx, info);

    if (
      (typeof permission === 'boolean' && permission) ||
      ctx.hasPermission(permission)
    ) {
      return getValue(p, args, ctx, info);
    }

    return null;
  };
}
