import { Gender, PersonResolvers, PersonType } from '../../../types';
import { withPermission } from '../../../utils';

export const Person = {
  id: (p) => p._key,

  birthdate: withPermission(
    'schulhof.administration.persons.persons.type.read',
    (p) => p.birthdate
  ),
  firstname: withPermission(
    'schulhof.administration.persons.persons.firstname.read',
    (p) => p.firstname
  ),
  lastname: withPermission(
    'schulhof.administration.persons.persons.lastname.read',
    (p) => p.lastname
  ),
  gender: withPermission(
    'schulhof.administration.persons.persons.gender.read',
    (p) =>
      ({
        m: Gender.Male,
        f: Gender.Female,
        o: Gender.Other,
      }[p.gender])
  ),
  type: withPermission(
    'schulhof.administration.persons.persons.type.read',
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
