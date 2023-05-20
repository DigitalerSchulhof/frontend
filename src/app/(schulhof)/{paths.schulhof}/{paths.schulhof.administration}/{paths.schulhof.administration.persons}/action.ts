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
  firstname: string;
  lastname: string;
};

export async function loadPersons(
  filter: LoadPersonsFilter
): Promise<Person[]> {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return [
    {
      id: '1',
      firstname: 'Jesper',
      lastname: 'Engberg',
    },
  ];
}
