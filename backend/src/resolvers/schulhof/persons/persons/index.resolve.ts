import { withPermission } from '../../../resolvers';
import { Gender, PersonResolvers, PersonType } from '../../../types';

export const Person = {
  id: (p) => p._key,

  birthdate: withPermission(
    'schulhof.administration.persons.persons.read.birthdate',
    (p) => p.birthdate
  ),
  firstname: withPermission(
    'schulhof.administration.persons.persons.read.firstname',
    (p) => p.firstname
  ),
  lastname: withPermission(
    'schulhof.administration.persons.persons.read.lastname',
    (p) => p.lastname
  ),
  gender: withPermission(
    'schulhof.administration.persons.persons.read.gender',
    (p) =>
      ({
        male: Gender.Male,
        female: Gender.Female,
        other: Gender.Other,
      }[p.gender])
  ),
  type: withPermission(
    'schulhof.administration.persons.persons.read.type',
    (p) =>
      ({
        student: PersonType.Student,
        teacher: PersonType.Teacher,
        parent: PersonType.Parent,
        administrator: PersonType.Administrator,
        other: PersonType.Other,
      }[p.type])
  ),
} satisfies PersonResolvers;
