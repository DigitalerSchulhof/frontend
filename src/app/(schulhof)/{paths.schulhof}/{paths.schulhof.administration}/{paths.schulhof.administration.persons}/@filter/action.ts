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
  name: string;
};

export async function loadPersons(
  filter: LoadPersonsFilter
): Promise<Person[]> {
  console.log('F', filter);
  return [];
}
