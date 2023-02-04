import { hasPermissionResolver } from '../../../resolvers';
import {
  PersonAccessResolvers,
  PersonActionsAccessResolvers,
  PersonFieldsAccessResolvers,
  PersonResolvers,
} from '../../../types';
import { identity } from '../../../utils';

export const Person = {
  access: identity,
} satisfies PersonResolvers;

export const PersonAccess = {
  fields: identity,
  actions: identity,
} satisfies PersonAccessResolvers;

export const PersonFieldsAccess = {
  birthdate: () => ({
    read: 'schulhof.administration.person.read.birthdate',
    write: 'schulhof.administration.person.write.birthdate',
  }),
  firstname: () => ({
    read: 'schulhof.administration.person.read.firstname',
    write: 'schulhof.administration.person.write.firstname',
  }),
  gender: () => ({
    read: 'schulhof.administration.person.read.gender',
    write: 'schulhof.administration.person.write.gender',
  }),
  lastname: () => ({
    read: 'schulhof.administration.person.read.lastname',
    write: 'schulhof.administration.person.write.lastname',
  }),
  type: () => ({
    read: 'schulhof.administration.person.read.type',
    write: 'schulhof.administration.person.write.type',
  }),
} satisfies PersonFieldsAccessResolvers;

export const PersonActionsAccess = {
  mail: hasPermissionResolver((p) => `schulhof.mail.send.${p.type}`),
  permissions: hasPermissionResolver(
    `schulhof.administration.person.write.permissions`
  ),
  changeTeacherId: hasPermissionResolver(
    `schulhof.administration.person.write.teacherId`
  ),
  delete: hasPermissionResolver(`schulhof.administration.person.delete`),
} satisfies PersonActionsAccessResolvers;
