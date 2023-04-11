import { T } from '#/i18n';
import { Translations } from '#/i18n/translations';
import { Heading } from '#/ui/Heading';
import { AdministrationSection } from '../../sections/types';
import {
  AdministrationOverviewSectionCard,
  AdministrationOverviewSectionCards,
} from '../card';

export const AdministrationOverviewSection = ({
  section,
}: {
  section: AdministrationSection;
}) => {
  const cards = section.slices.map((slice) => (
    <AdministrationOverviewSectionCard
      key={slice.id}
      sectionId={section.id}
      slice={slice}
    />
  ));

  return (
    <>
      <Heading size='2'>
        <T
          t={
            `schulhof.administration.sections.${section.id}.title` as keyof Translations
          }
        />
      </Heading>
      <AdministrationOverviewSectionCards>
        {cards}
      </AdministrationOverviewSectionCards>
    </>
  );
};
