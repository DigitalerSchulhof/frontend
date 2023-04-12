import { AdministrationSectionSlice } from '#/administration/sections/types';

export const personsRolesSlice: AdministrationSectionSlice = {
  id: 'roles',
  card: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    icon: require(`../../../../../../icons/32/award_star_gold_blue.png`)
      .default,
  },
};
