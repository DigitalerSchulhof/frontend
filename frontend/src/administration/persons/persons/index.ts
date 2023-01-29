import { getTranslation } from '@i18n';

export const ID = 'persons_persons';

export { Card } from './card';
export { Page } from './page';

export const path = [
  getTranslation('paths.schulhof'),
  getTranslation('paths.schulhof.administration'),
  getTranslation('paths.schulhof.administration.persons'),
  getTranslation('paths.schulhof.administration.persons.persons'),
];

export const breadcrumbs = [
  getTranslation('paths.schulhof'),
  getTranslation('paths.schulhof.administration'),
  {
    href: [
      getTranslation('paths.schulhof'),
      getTranslation('paths.schulhof.administration'),
    ],
    segment: getTranslation('paths.schulhof.administration.persons'),
    title: getTranslation(
      'paths.schulhof.administration.persons.title'
    ),
  },
  getTranslation('paths.schulhof.administration.persons.persons'),
];
