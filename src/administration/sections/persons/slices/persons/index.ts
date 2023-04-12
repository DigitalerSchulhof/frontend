import { AdministrationSectionSlice } from '#/administration/sections/types';

export const personsPersonsSlice: AdministrationSectionSlice = {
  id: 'persons',
  card: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: require(`../../../../../../icons/32/users_5.png`).default,
  },
};
