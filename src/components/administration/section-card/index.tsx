'use client';

import { T } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { Heading } from '#/ui/Heading';
import { Link, LinkProps } from '#/ui/Link';
import { StaticImageData } from 'next/image';
import { styled } from 'styled-components';

export const AdministrationSectionCard = ({
  title,
  description,
  icon,
  href,
}: {
  title: TranslationsWithStringTypeAndNoVariables;
  description: TranslationsWithStringTypeAndNoVariables;
  icon: StaticImageData;
  href: LinkProps['href'];
}) => {
  return (
    <StyledAdministrationSectionCard>
      <StyledAdministrationSectionCardLink href={href} $backgroundImage={icon}>
        <StyledAdministrationSectionCardHeading size='3' t={title} />
        <StyledAdministrationSectionCardDescription>
          <T t={description} />
        </StyledAdministrationSectionCardDescription>
      </StyledAdministrationSectionCardLink>
    </StyledAdministrationSectionCard>
  );
};

const StyledAdministrationSectionCard = styled.li`
  list-style-type: none;
  margin: 0;

  border-top: 1px solid #424242;

  &:last-child {
    border-bottom: 1px solid #424242;
  }
`;

const StyledAdministrationSectionCardLink = styled(Link)<{
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

const StyledAdministrationSectionCardHeading = styled(Heading)`
  margin-bottom: 3px;
`;

const StyledAdministrationSectionCardDescription = styled.p`
  font-size: 90%;
  margin-top: 2px;
`;
