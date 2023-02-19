import { PersonResolvers } from '../../../types';

export const Person = {
  id: (p) => p._key,

  birthdate: (p) => p.birthdate,
  firstname: (p) => p.firstname,
  lastname: (p) => p.lastname,
  gender: (p) =>
    ((
      {
        male: 'Male',
        female: 'Female',
        other: 'Other',
      } as const
    )[p.gender]),
  type: (p) =>
    ((
      {
        student: 'Student',
        teacher: 'Teacher',
        parent: 'Parent',
        administrator: 'Administrator',
        other: 'Other',
      } as const
    )[p.type]),
} satisfies PersonResolvers;
