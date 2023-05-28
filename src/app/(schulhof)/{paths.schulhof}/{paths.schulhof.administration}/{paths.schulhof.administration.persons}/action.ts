'use server';

export type LoadPersonsFilter = {
  lastname: string;
  firstname: string;
  class: string;
  typeStudent: boolean;
  typeTeacher: boolean;
  typeParent: boolean;
  typeAdmin: boolean;
  typeOther: boolean;
};

export type Person = {
  id: string;
  type: 'student' | 'teacher' | 'parent' | 'admin' | 'other';
  gender: 'male' | 'female' | 'other';
  firstname: string;
  lastname: string;
};

export async function loadPersons(
  filter: LoadPersonsFilter
): Promise<Person[]> {
  return [
    {
      id: '1',
      type: 'student',
      firstname: 'Test',
      lastname: 'Schüler',
      gender: 'male',
    },
    {
      id: '2',
      type: 'teacher',
      firstname: 'Test',
      lastname: 'Lehrer',
      gender: 'female',
    },
    {
      id: '3',
      type: 'parent',
      firstname: 'Test',
      lastname: 'Elter',
      gender: 'other',
    },
    {
      id: '4',
      type: 'admin',
      firstname: 'Test',
      lastname: 'Verwaltungsangestellter',
      gender: 'male',
    },
    {
      id: '5',
      type: 'other',
      firstname: 'Test',
      lastname: 'Externer',
      gender: 'female',
    },
    {
      id: '2052',
      type: 'teacher',
      firstname: 'Jesper',
      lastname: 'Engberg',
      gender: 'male',
    },
  ];
}
