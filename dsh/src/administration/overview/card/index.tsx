'use client';

import { T } from '#/i18n';
import {
  Translations,
  TranslationsWithStringTypeAndNoVariables,
} from '#/i18n/translations';
import { Heading } from '#/ui/Heading';
import { Link } from '#/ui/Link';
import { StaticImageData } from 'next/image';
import { styled } from 'styled-components';
import { AdministrationSectionSlice } from '../../sections/types';

export const AdministrationOverviewSectionCards = styled.ul``;

export const AdministrationOverviewSectionCard = ({
  sectionId,
  slice,
}: {
  sectionId: string;
  slice: AdministrationSectionSlice;
}) => {
  return (
    <StyledAdministrationOverviewSectionCard>
      <StyledAdministrationOverviewSectionCardLink
        href={[
          'paths.schulhof',
          'paths.schulhof.administration',
          `paths.schulhof.administration.${sectionId}` as TranslationsWithStringTypeAndNoVariables,
          `paths.schulhof.administration.${sectionId}.${slice.id}` as TranslationsWithStringTypeAndNoVariables,
        ]}
        $backgroundImage={slice.card.icon}
      >
        <StyledAdministrationOverviewSectionCardHeading size='3'>
          <T
            t={
              `schulhof.administration.sections.${sectionId}.slices.${slice.id}.card.title` as keyof Translations
            }
          />
        </StyledAdministrationOverviewSectionCardHeading>
        <StyledAdministrationOverviewSectionCardDescription>
          <T
            t={
              `schulhof.administration.sections.${sectionId}.slices.${slice.id}.card.description` as keyof Translations
            }
          />
        </StyledAdministrationOverviewSectionCardDescription>
      </StyledAdministrationOverviewSectionCardLink>
    </StyledAdministrationOverviewSectionCard>
  );
};

const StyledAdministrationOverviewSectionCard = styled.li`
  list-style-type: none;
  margin: 0;

  border-top: 1px solid #424242;

  &:last-child {
    border-bottom: 1px solid #424242;
  }
`;

const StyledAdministrationOverviewSectionCardLink = styled(Link)<{
  $backgroundImage: StaticImageData;
}>`
  display: block;

  color: inherit;
  background-image: ${({ $backgroundImage }) => `url(${$backgroundImage.src})`};
  background-repeat: no-repeat;
  background-position: 5px 5px;
  min-height: 42px;
  padding: 5px;
  padding-left: 47px;

  &:hover {
    background-color: #424242;
    color: inherit;
  }
`;

const StyledAdministrationOverviewSectionCardHeading = styled(Heading)`
  margin-bottom: 3px;
`;

const StyledAdministrationOverviewSectionCardDescription = styled.p`
  font-size: 90%;
  margin-top: 2px;
`;
