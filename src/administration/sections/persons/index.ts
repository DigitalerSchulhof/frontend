import { AdministrationSection } from '#/administration/sections/types';
import { personsPersonsSlice } from './slices/persons';
import { personsRolesSlice } from './slices/roles';

export const personsSection = {
  id: 'persons',
  slices: [personsPersonsSlice, personsRolesSlice],
} satisfies AdministrationSection;
