'use server';

import { requireLogin } from '#/auth/action';
import { PersonGender, PersonType } from '#/services/interfaces/person';
import { wrapAction } from '#/utils/action';
import type { Parse } from 'vality';
import { v } from 'vality';

export interface LoadPersonsPerson {
  permissions: {
    mayDetails: boolean;
    mayPermissions: boolean;
    mayEditPerson: boolean;
    mayCreateAccount: boolean;
    mayEditAccount: boolean;
    mayDeleteAccount: boolean;
    mayDeletePerson: boolean;
  };
  id: string;
  rev: string;
  type: 'student' | 'teacher' | 'parent' | 'admin' | 'other';
  gender: 'male' | 'female' | 'other';
  firstname: string;
  lastname: string;
  hasAccount: boolean;
}

const filterSchema = {
  lastname: v.string,
  firstname: v.string,
  class: v.string,
  type: v.number,
};

export type LoadPersonsFilter = Parse<typeof filterSchema>;

export default wrapAction(
  [filterSchema, v.number, v.number],
  async (
    filter,
    offset,
    limit
  ): Promise<{ items: LoadPersonsPerson[]; total: number }> => {
    const context = await requireLogin('schulhof.administration.persons.read');

    const persons = await context.services.person.searchPersons({
      filter,
      offset,
      limit: limit !== -1 ? limit : undefined,
    });

    const mayAllDetailsPromise = context.services.permission.hasPermission({
      permission: 'schulhof.administration.persons.details',
      context: {
        personId: '#all',
      },
    });

    // TODO
    const mayAllPermissionsPromise = Promise.resolve(false);

    const mayAllEditPersonPromise = context.services.permission.hasPermission({
      permission: 'schulhof.administration.persons.edit-person',
      context: {
        personId: '#all',
      },
    });

    const mayAllCreateAccountPromise =
      context.services.permission.hasPermission({
        permission: 'schulhof.administration.persons.create-account',
        context: {
          personId: '#all',
        },
      });

    const mayAllEditAccountPromise = context.services.permission.hasPermission({
      permission: 'schulhof.administration.persons.edit-account',
      context: {
        personId: '#all',
      },
    });

    const mayAllDeleteAccountPromise =
      context.services.permission.hasPermission({
        permission: 'schulhof.administration.persons.delete-account',
        context: {
          personId: '#all',
        },
      });

    const mayAllDeletePersonPromise = context.services.permission.hasPermission(
      {
        permission: 'schulhof.administration.persons.delete-person',
        context: {
          personId: '#all',
        },
      }
    );

    const [
      mayAllDetails,
      mayAllPermissions,
      mayAllEditPerson,
      mayAllCreateAccount,
      mayAllEditAccount,
      mayAllDeleteAccount,
      mayAllDeletePerson,
    ] = await Promise.all([
      mayAllDetailsPromise,
      mayAllPermissionsPromise,
      mayAllEditPersonPromise,
      mayAllCreateAccountPromise,
      mayAllEditAccountPromise,
      mayAllDeleteAccountPromise,
      mayAllDeletePersonPromise,
    ]);

    return {
      items: await Promise.all(
        persons.items.map(async (person) => {
          const mayDetailsPromise = mayAllDetails
            ? true
            : context.services.permission.hasPermission({
                permission: 'schulhof.administration.persons.details',
                context: {
                  personId: person.id,
                },
              });

          // TODO
          const mayPermissionsPromise = mayAllPermissions
            ? true
            : Promise.resolve(true);

          const mayEditPersonPromise = mayAllEditPerson
            ? true
            : context.services.permission.hasPermission({
                permission: 'schulhof.administration.persons.edit-person',
                context: {
                  personId: person.id,
                },
              });

          const mayCreateAccountPromise = mayAllCreateAccount
            ? true
            : context.services.permission.hasPermission({
                checkIf: !person.account,
                permission: 'schulhof.administration.persons.create-account',
                context: {
                  personId: person.id,
                },
              });

          const mayEditAccountPromise = mayAllEditAccount
            ? true
            : context.services.permission.hasPermission({
                checkIf: !!person.account,
                permission: 'schulhof.administration.persons.edit-account',
                context: {
                  personId: person.id,
                },
              });

          const mayDeleteAccountPromise = mayAllDeleteAccount
            ? true
            : context.services.permission.hasPermission({
                checkIf: !!person.account,
                permission: 'schulhof.administration.persons.delete-account',
                context: {
                  personId: person.id,
                },
              });

          const mayDeletePersonPromise = mayAllDeletePerson
            ? true
            : context.services.permission.hasPermission({
                permission: 'schulhof.administration.persons.delete-person',
                context: {
                  personId: person.id,
                },
              });

          const [
            mayDetails,
            mayPermissions,
            mayEditPerson,
            mayCreateAccount,
            mayEditAccount,
            mayDeleteAccount,
            mayDeletePerson,
          ] = await Promise.all([
            mayDetailsPromise,
            mayPermissionsPromise,
            mayEditPersonPromise,
            mayCreateAccountPromise,
            mayEditAccountPromise,
            mayDeleteAccountPromise,
            mayDeletePersonPromise,
          ]);

          return {
            id: person.id,
            rev: person.rev,
            firstname: person.firstname,
            lastname: person.lastname,
            type: (
              {
                [PersonType.Student]: 'student',
                [PersonType.Teacher]: 'teacher',
                [PersonType.Parent]: 'parent',
                [PersonType.Admin]: 'admin',
                [PersonType.Other]: 'other',
              } as const
            )[person.type],
            gender: (
              {
                [PersonGender.Male]: 'male',
                [PersonGender.Female]: 'female',
                [PersonGender.Other]: 'other',
              } as const
            )[person.gender],
            hasAccount: person.account !== null,
            permissions: {
              mayDetails: mayDetails,
              mayPermissions: mayPermissions,
              mayEditPerson: mayEditPerson,
              mayCreateAccount: mayCreateAccount,
              mayEditAccount: mayEditAccount,
              mayDeleteAccount: mayDeleteAccount,
              mayDeletePerson: mayDeletePerson,
            },
          } satisfies LoadPersonsPerson;
        })
      ),
      total: persons.total,
    };
  }
);
