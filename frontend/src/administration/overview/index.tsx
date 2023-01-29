import { TranslationAST, useT } from '@i18n';
import { Heading } from '@UI/Heading';
import { Link } from '@UI/Link';
import React from 'react';
import styled from 'styled-components';

export interface AdministrationElementCardProps {
  title: string;
  description: string;
  href: (string | TranslationAST<string>)[];
}
export const AdministrationElementCard: React.FC<
  AdministrationElementCardProps
> = (props) => {
  const t = useT();

  return (
    <StyledAdministrationElementCard href={props.href}>
      <Heading size="3">{props.title}</Heading>
      <p>{props.description}</p>
    </StyledAdministrationElementCard>
  );
};

const StyledAdministrationElementCard = styled(Link)``;
